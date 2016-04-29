import requests
import json
import random
import string

def add(name, email, pw):
	payload = {'name': name, 'email': email, 'pass': pw}
	print payload
	r = requests.post('http://scheduler.intense.io/api/user', data=payload)
	print(r.json())

def main():
	for i in range(100):
		name = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(7))
		email = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
		email += '@' + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8)) + '.com'
		pw = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
		add(name, email, pw)

if __name__ == '__main__':
	main()
