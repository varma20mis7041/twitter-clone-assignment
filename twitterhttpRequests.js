POST  http://localhost:3000/register/
Content-Type: application/json

{
    "username": "adam_richard",
    "password": "richard_567",
    "name": "Adam Richard",
    "gender": "male"
}
### API-1

POST http://localhost:3000/login/
Content-Type: application/json

{
  "username":"JoeBiden",
  "password":"biden@123"
}
###
GET http://localhost:3000/users/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-2


GET  http://localhost:3000/user/tweets/feed
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-3

GET  http://localhost:3000/user/following
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-4

GET  http://localhost:3000/user/followers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-5

GET  http://localhost:3000/tweets/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-6

GET  http://localhost:3000/tweets/1/likes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-7

GET  http://localhost:3000/tweets/2/replies
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-8


GET  http://localhost:3000/user/tweets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-9


POST   http://localhost:3000/user/tweets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
Content-Type: application/json

{
    "tweet": "The Mornings..."
}
### API-10

DELETE  http://localhost:3000/tweets/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvZUJpZGVuIiwicGFzc3dvcmQiOiJiaWRlbkAxMjMiLCJpYXQiOjE2ODc4NjU3OTh9.NHeQnus0cLNmX_itnbR0eou3QvNOt8itRMM-e81ooRk
### API-11


