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
$token = my_hash['token']

################
####Get Tags####
################
$uri = URI.parse("http://localhost:3000/api/tags")
$http = Net::HTTP.new(uri.host, uri.port)

$tagID_bedroom1 = "Bedroom-001"
$tagID_bedroom2 = "Bedroom-002"
$tagID_kitchen = "Kitchen-001"
$tagID_bathroom1 = "Bathroom-001"
$tagID_bathroom2 = "Bathroom-002"
$tagID_lr = "LivingRoom-001"
$tagID_front = "FrontEnt-001"
$tagID_back = "BackEnt-001"

count = 0

##Function Prototype
#def functionname(variable)
#   return <value>
#end

#Submit Tag Function, returns hash of HTTP response, use 'pp' to display
def submitTag(tagID, tagScanDate)
	tsdISO = tagScanDate.iso8601

	request = Net::HTTP::Post.new($uri.request_uri)
	request['x-access-token'] = $token

	#request.to_hash['x-access-token']    # => Array
	#puts "Headers: #{request.to_hash.inspect}"

	request.set_form_data({"tagID" => tagID, "tagScanDate" => tsdISO})
	puts "tagID: " + tagID
	puts "tagScanDate: " + tsdISO
    
	#response = http.request(request)
	#my_hash = JSON.parse(response.body)
	#pp my_hash
	#return my_hash
end

#Bathroom visit, takes input time and bathroom ID as input, returns time after visit is completed
def bathroomVisit(inputTime, bathroomNum)

	timeEnter = inputTime

	randomTimeInBath = 60+ rand(60*9)
	#adding 60 in addition of one minute

	tempTime = inputTime
	if bathroomNum == 1 
		response = submitTag($tagID_bathroom1, timeEnter)
	else
		puts "Unregistered Bathroom"
	end
	
end

#loops through the week
for i in 0..6
	day = Time.new(2015, 2, 18)
	dayConstant = i * (60*60*24)

	puts "Day " + i.inspect
	puts "=========================="

	day += dayConstant

	#initial bed scans, random amount of bathroom trips in a night

	#leaving bedroom, go from bathroom to kitchen

	#random movement between kitchen, living room, bathroom

	#five bathroom trips a day
	for i in 0..5
		randomTimeOfDay = rand(60*60*24)
		
		bathroomVisit(day + randomTimeOfDay, 1)

		count += 2		
	end

end

puts count.inspect + " tags entered into DB"