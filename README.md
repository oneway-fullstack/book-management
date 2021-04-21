# book-management
A Django app with Vue.js app at front-end which allows a user to create list with favorite books and manage it: 
- customer should be able to login into the app using his own credentials 
- user must be able to see list of books he already added, create new, modify and delete them 
- book model must contain following fields: -- author -- title -- description -- poster image Front-end requirements: 
- Use Vuex and Vue router 
- Use Element UI as front-end framework. No additional styling required 
- Use Axios in order to communicate with API 

Back-end requirements: 
- Use django-webpack-loader 
- Use django-rest-framework 
- Use Django's users model


Basic Commands
--------------
Two Commands...


**1st**
```
cd frontend
npm install
npm run lint
npm run serve
```

**2nd**

```
virtualenv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

