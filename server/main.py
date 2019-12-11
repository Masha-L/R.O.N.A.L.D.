from google.cloud import bigquery
# [START imports]
from flask import Flask, render_template, request
import json
import operator
import string
import math


app = Flask(__name__)
client = bigquery.Client()

@app.route('/api/books-to-rate',  methods=['GET'])
def booksToRate():
    query_job = client.query(""" SELECT * FROM books_complete.all_books WHERE RAND() < 100/542000""")
    results = query_job.result() # Waits for job to complete.
    docs = []
    for row in results:
        docs.append({"title":[row.title], "description":row.description, "category":row.category})
    return json.dumps(docs), 200, {'Content-Type': 'application/json'}

@app.route('/api/recommendations',  methods=['POST'])
def recommendations():
    docs = request.get_json()
    results = getSomeFancyBooks(docs)

    # results = getSomeBooks(docs) # Waits for job to complete.
    return json.dumps(results), 200, {'Content-Type': 'application/json'}


def getSomeFancyBooks(docs):
    docs.sort(key=rating, reverse=True)
    titles = []
    for d in docs:
        titles.append(d[0][0])
    # get best ranking categories
    ranked_cats = getRankedCategories(docs)
    # create tf for the queries
    q_tf = getFancyTF(docs)
    # get best ranking terms
    ranked_q_tf = dictToSortedList(q_tf, tf)
    #run a query based on that
    query_job = client.query(
        """SELECT * FROM books_complete.all_books 
        WHERE ARRAY_TO_STRING(category, ' ') like \"% """+ ranked_cats[0][0]
        +"""%\" OR ARRAY_TO_STRING(category, ' ') like  \"%"""+ ranked_cats[1][0]
        +"""%\" AND (ARRAY_TO_STRING(description, ' ') like  \"%"""+ranked_q_tf[0][0]
        +"""%\" OR ARRAY_TO_STRING(description, ' ') like  \"%"""+ranked_q_tf[1][0]
        +"""%\") LIMIT 10000""")
    # get results and put them to have normal-ish format
    results = query_job.result() # Waits for job to complete.
    books = {}
    tf_in_docs = {}
    collection_word_len = 0;
    collection_docs = 0;
    for row in results:
        collection_docs+=1
        # title: [{term: freq}, description]
        books[row.title] = [get_word_counts(tokenize(row.description[0]+" "+row.title)), row.description[0], row.category, len(row.description[0])]
        tokens = list(set(tokenize(row.description[0]+" "+row.title)))
        for t in tokens:
            if t in tf_in_docs:
                tf_in_docs[t] += 1
            else:
                tf_in_docs[t] = 1

        collection_word_len+=len(row.description[0])

    avg_doc_len = collection_word_len/collection_docs

    # tf_idf
    recs = []
    for title, book_info in books.items():
        score = 0
        for term, tfq in q_tf.items():
            if term in book_info[0]:
                tfd = book_info[0][term]
                df = tf_in_docs[term]
                idf = math.log(collection_docs/df)
                norm_tf = tfq * (tfd/(tfd + (2*book_info[3]/avg_doc_len))) *idf
                score += norm_tf
        if title not in titles:
            recs.append([title, book_info[1], score])

    recs.sort(key=rating, reverse=True)

    recs = recs[:10]

    best_recs = []
    for r in recs:
        best_recs.append({"title":r[0], "description":r[1]})

    return best_recs




def getRankedCategories(docs):
    categories = {}
    for doc in docs:
        for c in doc[3]:
            if c != "Books":
                if c in categories:
                    ratings = categories[c]
                    numScores = ratings[1]
                    score = ratings[0]*numScores
                    newScore = (score + rating(doc))/(numScores+1)
                    categories[c] = [newScore, numScores+1]
                else:
                    categories[c] = [rating(doc), 1]
    return dictToSortedList(categories, cat)

def cat(element):
    return element[1][0]

def getFancyTF(docs):
    tf = {}
    stop_words = read_text('english.stop')
    stop_words_list = tokenize(stop_words)

    for d in docs:
        query = d[0][0]+" "+d[1][0]
        clean_query = tokenize(query)
        for word in clean_query:
            if word not in stop_words_list:
                if word in tf:
                    tf[word]+=(rating(d)-5)
                else:
                    tf[word] = (rating(d)-5)
    return tf

def dictToSortedList(dict, sort_key):
    qlist = []
    for key, value in dict.items():
        temp = [key,value]
        qlist.append(temp)
    qlist.sort(key=sort_key, reverse=True)
    return qlist

def getSomeBooks(docs):
    docs.sort(key=rating, reverse=True)
    # get rid of lowest 5
    docs=docs[:5]
    query = ""
    # concatenate the rest
    for d in docs:
        query=query+d[0][0]+" "+d[1][0]+" "

    list_query = tokenize(query)
    stop_words = read_text('english.stop')
    stop_words_list = tokenize(stop_words)

    clean_list_query = []
    for item in list_query:
        if item not in stop_words_list:
            clean_list_query.append(item)

    # build tf dictionary
    query_dict = get_word_counts(clean_list_query)
    # identify term with highest frequency
    qlist = []
    for key, value in query_dict.items():
        temp = [key,value]
        qlist.append(temp)

    qlist.sort(key=tf, reverse=True)
    # send a query
    query_job = client.query("""SELECT * FROM books_complete.all_books WHERE ARRAY_TO_STRING(description, ' ') like \"%"""+qlist[0][0]+"""%\" OR ARRAY_TO_STRING(description, ' ') like \"%"""+qlist[1][0]+"""%\" LIMIT 10000""")

    results = query_job.result() # Waits for job to complete.
    
    books = {}
    for row in results:
        # title: [{term: freq}, description]
        books[row.title] = [get_word_counts(tokenize(row.description[0]+" "+row.title)), row.description[0], row.category]
        # recs.append({"title":row.title, "description":row.description})

    results = []
    for book, tf_dict in books.items():
        score = 0
        for term, tfq in query_dict.items():
            if term in tf_dict[0]:
                score += tfq * tf_dict[0][term]
        results.append([book, tf_dict[1], score])

    results.sort(key=rating, reverse=True)

    results = results[:10]

    recs = []
    for r in results:
        recs.append({"title":r[0], "description":r[1]})

    return recs





#tokenized and normalizes text
def tokenize(text):
    clear_text = normalize(text)
    return clear_text.split()

def tf(item):
    return item[1]

# normalizes string (strips punctuation & to lower case)
def normalize(text):
    lower_text = text.lower()
    translator = str.maketrans('', '', string.punctuation)
    return lower_text.translate(translator)

def read_text(file_name):
    f = open(file_name,'r')
    text = f.read()
    f.close()
    return text

def rating(element):
    return element[2]

def get_word_counts(tokens):
        word_count_dict = {} #create an empty dictionaryself,
        #loops through the elements in tokens
        for i in tokens:
            if (word_count_dict.get(i,0) == 0):  #Chekcks if token is in the dictionary
                word_count_dict[i] = 1 #if not it adds it to the dictionary with a value of 1
            else:
                word_count_dict[i] += 1 #If it is its value is incremented by 1
        return word_count_dict

if __name__ == '__main__':
 app.run()




# from google.appengine.api import users
# from google.appengine.ext import ndb

# [END imports]

# client = bigquery.Client()

# # GET START PACK OF DRAMAS
# query_job = client.query("""SELECT * FROM books_complete.all_books WHERE ARRAY_TO_STRING(category, ' ') like '%Drama%'
# LIMIT 100""")

# results = query_job.result()  # Waits for job to complete.
# for row in results:
#     print("{} : {} \n".format(row.title, row.category))
