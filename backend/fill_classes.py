import os
import sys
import subprocess

def main():
	with open('subjects.txt', 'r') as f:
		for subject in f:
			p = subprocess.call('node queryCourseExplorer.js 2016 ' + subject, stdout=sys.stdout.fileno(), stderr=sys.stdout.fileno(), shell=True)
			print('Process exited with code {}'.format(p))

if __name__ == '__main__':
	main()
