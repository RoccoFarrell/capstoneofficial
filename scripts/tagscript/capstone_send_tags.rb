=begin rdoc

=Alien Ruby RFID Library Examples
==ex_get_taglist.rb

An example program to play with taglists. 

* Connect to an Alien RFID reader. Login.
* Grab some tag data.
* Scan the data for interesting tags and display the results.

Copyright 2008, Alien Technology Corporation. All rights reserved.

=end

#Add the default relative library location to the search path
$:.unshift File.join(File.dirname(__FILE__),"..","lib")

require 'alienreader'
require 'alientag'
require 'alienconfig'
require 'net/http'
require 'uri'
require 'date'
require 'bson'
require 'json'
require 'pp'

$patientName = ""
$postDestination = ""

def postTagToServer(tagLocation, tagScanDate)
	##################
	##Authentication##
	##################

	if($postDestination != nil)
		uri = URI.parse($postDestination + "/api/authenticate")
		username = "capstone"
		password = "capstone"
		
		http = Net::HTTP.new(uri.host, uri.port)
		request = Net::HTTP::Post.new(uri.request_uri)
		
		request.set_form_data({"username" => username, "password" => password})
		response = http.request(request)

		my_hash = JSON.parse(response.body)
		pp my_hash
		
		##################
		#####Get Tags#####
		##################
		uri = URI.parse($postDestination + "/api/tags")
		token = my_hash['token']

		http = Net::HTTP.new(uri.host, uri.port)
		request = Net::HTTP::Post.new(uri.request_uri)
		request['x-access-token'] = token
		
		#request.to_hash['x-access-token']    # => Array
		#puts "Headers: #{request.to_hash.inspect}"
		
		request.set_form_data({"tagID" => tagLocation, "tagScanDate" => tagScanDate, "tagPatient"=> $patientName})
		response = http.request(request)

		my_hash = JSON.parse(response.body)
		puts "---> Sent to server"
		puts "---> tagScanDate: " + tagScanDate + "\ntagLocation: " + tagLocation + "\npatientName: " + $patientName
		pp my_hash
		
		return my_hash

	else
		puts "tagScanDate: " + tagScanDate + "\ntagLocation: " + tagLocation + "\npatientName: " + $patientName
		return "Printed to console"
	end
end

# A little regular expression scanner. Looks at a list of tags and returns a message 
# containing those tag IDs that match a particular regular expression filter.
def filter_tags(tl, filter)
	i=0
	tagList= Array.new()

	tl.each do |tag|
		#puts "individual tag: " + tag.id
		if tag.id =~ /\A\d{4}\Z/
			tagList[i] = tag.id
			i+=1
		end

		#if tag.id =~ filter 
		#	msg <<( i.to_s + "\t" + tag.id + "\r\n")
		#end
		
	end
	return tagList
end
def filter_tags1(tl, filter)
	
	msg1 = ""
	tl.each do |tag|
		
		msg1 << (tag.id)
		return msg1
		
	end
	return msg1
end
def filter_tags2(tl, filter)
	
	msg2 = DateTime.new(2001,2,1)
	tl.each do |tag|
		
		#msg2 << (tag.last)
		msg2 = tag.last
		#msg2 << tag.last
		return msg2
		
	end
	return msg2
end
def conv(tagID)

	if tagID==1
		return "Kitchen-001"
	elsif tagID==2
		return "LivingRoom-001"
	elsif tagID==3
		return "Hallway-001"
	elsif tagID==4
		return "Bedroom-002"
	elsif tagID==5
		return "Bedroom-001"
	elsif tagID==6
		return "Bathroom-001"
	else
		return "ERROR: Tag not known: " + tagID.to_s
	end
end

# Takes a string returned from a Taglist function call and builds an array of tags.
def build_tag_array(taglist_string)
	tl = Array.new 

	# grab the taglist from the reader, split it into individual line entries...
	lines = taglist_string.split("\r\n")

	# ...and build an array of tag objects
	lines.each do |line|
		if line =="(No Tags)" 
			tl = []
		else
			tl.push(AlienTag.new(line))
		end
	end
	return tl
end

def initialSetup()

	puts "Which user will you be tracking today?"
	puts "1: Steve Rolphoson"
	puts "2: Jessica Silver"
	nameSelect = gets.chomp

	if(nameSelect == "1")
		$patientName = "Steve Rolphoson"
	elsif(nameSelect == "2")
		$patientName = "Jessica Silver"
	else
		puts "Invalid input"
	end

	puts "Which server will we be posting to today?"
	puts "1: Print to console"
	puts "2: Localhost"
	puts "3: DigitalOcean"
	postSelect = gets.chomp

	if(postSelect == "1")
		$postDestination = nil
	elsif(postSelect == "2")
		$postDestination = "http://localhost"
	elsif(postSelect == "3")
		$postDestination = "http://104.236.38.217"
	else
		puts "Invalid input to post destination"
	end

	puts "Welcome " + $patientName
end

begin
	initialSetup()
	# grab various parameters out of a configuration file
	#config = AlienConfig.new("config.dat")
	msg1=0
	# change "reader_ip_address" in the config.dat file to the IP address of your reader.
	#ipaddress = config["reader_ip_address"] 
	ipaddress = "192.168.1.3"
	# create a reader
	r = AlienReader.new

	# create a tag list
	tl = Array.new 

	# use your reader's IP address here.
	if r.open(ipaddress)
		puts "----------------------------------"
		puts 'Connected to: ' + r.readername
		puts "----------------------------------"

		previous=""
		count=0
		tagCount=0

		while 1==1
		# construct a taglist from the reader's tag list string
		# Note: if automode is running this will contain the latest tags. --If not,
		# the reader will read tags and then return the data.
			count=count+1

			tl = build_tag_array(r.taglist)
			tl_length = tl.length
			
			msg1 = filter_tags1(tl, /.*/)#/A5.*2.*1/)
			msg2 = filter_tags2(tl, /.*/)#/A5.*2.*1/)
			
			if(tl_length != 0)
				#puts "Number of tags found: " + tl_length.to_s
			end

			if(tl_length == 2 || tl_length == 1)
				fullTagList = filter_tags(tl, /.*/)
				#puts "full tag list: " + fullTagList.inspect
				#puts "ftl is array: " + fullTagList.instance_of?(Array).inspect
			end

			#if previous!=msg1 || y==5
			#if chrisFilter1
			if previous!=msg1 && msg1!=nil && msg1.length == 4 && fullTagList.size == 1

				currentTag = msg1.delete('')

				if(tagCount == 0)
					tempID = currentTag
					tagCount += 1
				elsif(tempID != currentTag)
					tagCount = 0
					tempID = currentTag
				else
					tagCount += 1
				end

				#puts "tag count: " + tagCount.inspect

				if(tagCount > 14)

					tagID = msg1.delete(' ')
					location = conv(tagID.to_i)

					bsonDate = msg2.iso8601

					#serverResponse = postTagToServer(tagID, msg2)
					serverResponse = postTagToServer(location, bsonDate)
					#puts serverResponse

					previous=msg1
					tagCount = 0
				end
			
			#end chrisFilter1
			end

		#t1.clear
		#z=z+1
		#sleep 1

		#end while
		end

	#puts msg
	puts "----------------------------------"

	# be nice. Close the connection.
		r.close
	#end if
	end
rescue 
	puts $!
end
