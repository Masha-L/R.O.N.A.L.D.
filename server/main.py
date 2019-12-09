from google.cloud import bigquery
# [START imports]
from flask import Flask, render_template, request
import json
import operator
import string

app = Flask(__name__)
client = bigquery.Client()

@app.route('/api/books-to-rate',  methods=['GET'])
def booksToRate():
    query_job = client.query(""" SELECT * FROM books_complete.all_books WHERE RAND() < 100/542000""")
    results = query_job.result() # Waits for job to complete.
    docs = []
    for row in results:
        docs.append({"title":[row.title], "description":row.description})
    return json.dumps(docs), 200, {'Content-Type': 'application/json'}

@app.route('/api/recommendations',  methods=['POST'])
def recommendations():
    docs = request.get_json()
    results = getSomeBooks(docs) # Waits for job to complete.

    return json.dumps(results), 200, {'Content-Type': 'application/json'}




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
    query_job = client.query("""SELECT * FROM books_complete.all_books WHERE ARRAY_TO_STRING(description, ' ') like \'%"""+qlist[0][0]+"""%\' OR ARRAY_TO_STRING(description, ' ') like \'%"""+qlist[1][0]+"""%\' LIMIT 10000""")

    results = query_job.result() # Waits for job to complete.
    
    books = {}
    for row in results:
        # title: [{term: freq}, description]
        books[row.title] = [get_word_counts(tokenize(row.description[0]+" "+row.title)), row.description[0]]
        # recs.append({"title":row.title, "description":row.description})

    results = []
    for book, tf_dict in books.items():
        score = 0
        for term, tfq in query_dict.items():
            if term in tf_dict:
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
