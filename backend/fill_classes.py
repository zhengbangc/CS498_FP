import requests
import json
import random
import string

def add(name, description):
	payload = {'name': name, 'description': description}
	print payload
	r = requests.post('http://scheduler.intense.io/api/class', data=payload)
	print(r.json())

def main():
	for i in range(100):
		name = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(7))
		description = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(64))
		add(name, description)

if __name__ == '__main__':
	main()
