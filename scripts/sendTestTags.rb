require "net/http"
require "uri"
require "json"
require "pp"
require "bson"
require "time"

##################
##Authentication##
##################
uri = URI.parse("http://localhost:3000/api/authenticate")
username = "capstone"
password = "capstone"
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Post.new(uri.request_uri)
request.set_form_data({"username" => username, "password" => password})
response = http.request(request)
my_hash = JSON.parse(response.body)

##################
#####Get Tags#####
##################
uri = URI.parse("http://localhost:3000/api/tags")
http = Net::HTTP.new(uri.host, uri.port)
token = my_hash['token']

tagID = "Bathroom-Door-001"

count = 0

#loops through the week
for i in 0..6
	day = Time.new(2015, 2, 14)
	dayConstant = i * (60*60*24)

	puts "Day " + i.inspect
	puts "=========================="

	day += dayConstant

	#five bathroom trips a day
	for i in 0..5
		tsdEnter = day
		tsdExit = day
		randomTimeOfDay = rand(60*60*24)

		#puts "day:      " + day.inspect
		
		tsdEnter += randomTimeOfDay
		tsdExit += randomTimeOfDay

		randomTimeInBath = 60+ rand(60*9)
		#adding 60 in addition of one minute
		#tagScanDate += 60;

		tsdExit += randomTimeInBath

		puts "tsdEnter: " + tsdEnter.inspect
		puts "tsdExit: " + tsdExit.inspect
		puts " "

		#puts tagScanDate.strftime("Printed on %m/%d/%Y") 
		#puts tagScanDate.strftime("at %I:%M%p")

		tsdEnterIso = tsdEnter.iso8601
		tsdExitIso = tsdExit.iso8601

		requestEnter = Net::HTTP::Post.new(uri.request_uri)
		requestEnter['x-access-token'] = token

		requestExit = Net::HTTP::Post.new(uri.request_uri)
		requestExit['x-access-token'] = token

		#request.to_hash['x-access-token']    # => Array
		#puts "Headers: #{request.to_hash.inspect}"

		requestEnter.set_form_data({"tagID" => tagID, "tagScanDate" => tsdEnterIso})
		requestExit.set_form_data({"tagID" => tagID, "tagScanDate" => tsdExitIso})

		responseEnter = http.request(requestEnter)
		responseExit = http.request(requestExit)

		count += 2

		#puts(response)

		my_hash = JSON.parse(response.body)
		#pp my_hash
		
	end

end

puts count.inspect + " tags entered into DB"