import socket
import time
import datetime
import json

def writeToLog(text):
	fil = open("/media/floris/New Volume/accesslog", "r+")
	msg = str(datetime.datetime.now()) + ": " + text
	print(msg)
	fil.read()
	fil.write(msg  + "\n")
	fil.close()

def getFilesOfUser(person):
	if "\n" in person or " " in person:
		return "illegal person"

	with open("USER FILE PATH", "r") as fil:
		file = json.loads(fil)
		if person in file:
			return file[person]
		else:
			return "file does not exist"


def getUsersOfFile(filename):
	if "\n" in filename or " " in filename:
		return "illegal filename"

	with open("FILE USER PATH", "r") as fil:
		file = json.loads(fil)
		if filename in file:
			return file[filename]
		else:
			return "file does not exist"


def takeFileFrom(filename, person):
	if "\n" in filename or " " in filename or "\n" in person or " " in person:
		return "illegal filename or person"

	#remove user to file
	with open("FILE USER PATH", "r+") as fil:
		file = json.loads(fil.read())
		fil.seek(0,0)

		if filename not in file:
			file[filename] = []

		if person in file[filename]:
			file[filename].remove(person)

		fil.write(json.dumps(file))
		fil.truncate()

	#add file to user
	with open("USER FILE PATH", "r+") as fil:
		file = json.loads(fil.read())
		fil.seek(0,0)

		if person not in file:
			file[person] = []

		if filename in file[person]:
			file[person].remove(filename)

		fil.write(json.dumps(file))
		fil.truncate()



	return "success"

def giveFileTo(filename, person):
	if "\n" in filename or " " in filename or "\n" in person or " " in person:
		return "illegal filename or person"

	#add user to file
	with open("FILE USER PATH", "r+") as fil:
		file = json.loads(fil.read())
		fil.seek(0,0)

		if filename not in file:
			file[filename] = []

		if person not in file[filename]:
			file[filename].append(person)

		fil.write(json.dumps(file))

	#add file to user
	with open("USER FILE PATH", "r+") as fil:
		file = json.loads(fil.read())
		fil.seek(0,0)

		if person not in file:
			file[person] = []

		if filename not in file[person]:
			file[person].append(filename)

		fil.write(json.dumps(file))


	return "success"

PORT = 10620
HOST = "0.0.0.0"

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server_socket.bind((HOST, PORT))

server_socket.listen(5)

writeToLog("started listening")
while True:
	client_socket, client_address = server_socket.accept()
	request = client_socket.recv(1500).decode()
	headers = request.split('\n')
	fh_components = headers[0].split()
	http_method = fh_components[0]
	path = fh_components[1]
	personIp = request.split("X-Forwarded-For: ")[1].split('\n')[0]
	chosenPath = "/media/floris/New Volume/content"+path

	content = ""
	try:
		fil = open(chosenPath, "r")
		content = fil.read()
		if content.startswith("not_allowed"):
			writeToLog("tried to access illegal file \"" + path + "\": " + personIp)
			content = "no access"
		else:
			writeToLog("tried to access file \"" + path + "\": " + personIp)
		fil.close()
	except:
		content = "could not open file"
		writeToLog("tried to access non existent file \"" + path + "\": " + personIp)

	if "../" in chosenPath:
		content = "illegal path"
		writeToLog("naughty person used ../ in \"" + path + "\": " + personIp)

	response = (
			f"HTTP/1.1 200 OK\r\n"+
			 "Access-Control-Allow-Origin: *\r\n\r\n"+
			 content).encode()
	client_socket.sendall(response)


