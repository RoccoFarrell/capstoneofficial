require "net/http"
require "uri"
require "json"
require "pp"
require "bson"
require "time"

$tagID_bedroom1 = "Bedroom-001"
$tagID_bedroom2 = "Bedroom-002"
$tagID_hallway = "Hallway-001"
$tagID_kitchen = "Kitchen-001"
$tagID_bathroom1 = "Bathroom-001"
$tagID_bathroom2 = "Bathroom-002"
$tagID_lr = "LivingRoom-001"
$tagID_front = "FrontEnt-001"
$tagID_back = "BackEnt-001"

$minute = 60
$hour = 60 * $minute
$day = $hour * 24
$week = $day * 7
$walkingConstant = 3 + rand(5)

$currentLocation = " "

$bathroomLevel = 0
$hungerLevel = 0

$count = 0

$patientName=""
$postDestination=""

##Function Prototype
#def functionname(variable)
#   return <value>
#end
def initialSetup()

	puts "Which user will you be tracking today?"
	puts "0: Enter new name"
	puts "1: Steve Rolphoson"
	puts "2: Jessica Silver"
	nameSelect = gets.chomp

	if(nameSelect == "1")
		$patientName = "Steve Rolphoson"
	elsif(nameSelect == "2")
		$patientName = "Jessica Silver"
	elsif(nameSelect == "0")
		puts "Enter patient name now: "
		$patientName = gets.chomp
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

	$numDays = 0
	puts "How many days would you like to generate?"
	$numDays = gets.chomp

	puts "Welcome " + $patientName + ". Posting to " + $postDestination.inspect + ". Generating " + $numDays + " days."

	##################
	##Authentication##
	##################
	if($postDestination != nil)
		uri = URI.parse($postDestination + "/api/authenticate")
		username = "capstone"
		password = "capstone"
		$http = Net::HTTP.new(uri.host, uri.port)
		request = Net::HTTP::Post.new(uri.request_uri)
		request.set_form_data({"username" => username, "password" => password})
		response = $http.request(request)
		my_hash = JSON.parse(response.body)
		$token = my_hash['token']

		$uri = URI.parse($postDestination + "/api/tags")
		$http = Net::HTTP.new(uri.host, uri.port)
	end
end

initialSetup()

#Submit Tag Function, returns hash of HTTP response, use 'pp' to display
def submitTag(tagID, tagScanDate)

	tsdISO = tagScanDate.iso8601
	$count += 1
	puts "-----> Submitted tag   tagID: " + tagID + " tagScanDate: " + tagScanDate.strftime("%I:%M:%S%p %m/%d/%y")

	if($postDestination != nil)
		request = Net::HTTP::Post.new($uri.request_uri)
		request['x-access-token'] = $token

		#request.to_hash['x-access-token']    # => Array
		#puts "Headers: #{request.to_hash.inspect}"

		request.set_form_data({"tagID" => tagID, "tagScanDate" => tsdISO, "tagPatient" => $patientName})
	
		response = $http.request(request)
		my_hash = JSON.parse(response.body)
		return my_hash
	else return "Posted to console"
	end

	#pp my_hash
	
end

#Bathroom visit, takes input time, bathroom ID, bathroom function as input, returns time after visit is completed
#bathroomFunc is a variable where '1' is a #1, '2' is a #2, '3' is a shower
def bathroomVisit(inputTime, bathroomNum, bathroomFunc, source, destination)

	if bathroomNum == 1 
		submitBathroomID = $tagID_bathroom1
	else
		puts "Unregistered Bathroom"
	end

	if(inputTime == nil)
		puts "InputTime to bathroomVisit is nil"
	end

	#enter bathroom
	inputTime = houseTrip(inputTime, source, $tagID_bathroom1)

	if bathroomFunc == 1
		inputTime += ($minute + rand($minute*4))
	elsif bathroomFunc == 2
		inputTime += (5*$minute + rand($minute*5))
	elsif bathroomFunc == 3
		inputTime += (10*$minute + rand($minute*10))
	end

	#exit bathroom, another hallwayscan after random amount of time in bath ( ~5min)
	#puts "At return --->>>> inputTime: " + inputTime.strftime("%I:%M:%S%p %m/%d/%y")
	#puts "Now going from " + $tagID_bathroom1 + " to " + destination
	#inputTime =  
	#puts "inputTime: " + inputTime.inspect
	return houseTrip(inputTime, $tagID_bathroom1, destination)
end

####################################
########Living room visit###########
####################################
#lrFunc values are '1' for chillin, '2' for chillin hard, '3' for midday grandma nap on the couch
def livingRoomVisit(inputTime, lrFunc, source, destination)

	#puts "inputTime in lrVisit: " + inputTime.inspect
	inputTime = houseTrip(inputTime, source, $tagID_lr)

	if lrFunc == 1
		inputTime += $minute*15 + rand($minute*15)
	elsif lrFunc == 2
		inputTime += 30*$minute + rand($minute*30)
	elsif lrFunc == 3
		inputTime += 60*$minute + rand($hour*2)
	end

	#exit bathroom, another hallwayscan after random amount of time in bath ( ~5min)
	#puts "At return --->>>> inputTime: " + inputTime.strftime("%I:%M:%S%p %m/%d/%y")
	#puts "Now going from " + $tagID_bathroom1 + " to " + destination
	#inputTime =  
	#puts "inputTime after LR chillin: " + inputTime.inspect
	return houseTrip(inputTime, $tagID_lr, destination)
end

####################################
########Kitchen visit###############
####################################
#kitchenFunc can be different meals, for now, 1 is a quick drink, 2 is a snack, 3 is a meal
def kitchenVisit(inputTime, kitchenFunc, source, destination)

	#enter bathroom
	inputTime = houseTrip(inputTime, source, $tagID_kitchen)

	if kitchenFunc == 1
		inputTime += 30 + rand(30)
	elsif kitchenFunc == 2
		inputTime += 4*$minute + rand($minute*4)
	elsif kitchenFunc == 3
		inputTime += 15*$minute + rand($minute*15)
	end

	#exit bathroom, another hallwayscan after random amount of time in bath ( ~5min)
	#puts "At return --->>>> inputTime: " + inputTime.strftime("%I:%M:%S%p %m/%d/%y")
	#puts "Now going from " + $tagID_bathroom1 + " to " + destination
	#inputTime =  
	#puts "inputTime: " + inputTime.inspect
	return houseTrip(inputTime, $tagID_kitchen, destination)
end

####################################
########Bedroom visit###############
####################################
#kitchenFunc can be different meals, for now, 1 is a quick drink, 2 is a snack, 3 is a meal
def bedroomVisit(inputTime, bedroomNum, bedroomFunc, source, destination)

	if bedroomNum == 1 
		submitBedroomID = $tagID_bedroom1
	elsif bedroomNum == 2
		submitBedroomID = $tagID_bedroom2
	else
		puts "Unregistered Bedroom"
	end

	#enter bedroom
	inputTime = houseTrip(inputTime, source, submitBedroomID)

	if bedroomFunc == 1
		inputTime += 30 + rand(30)
	elsif bedroomFunc == 2
		inputTime += 4*$minute + rand($minute*4)
	elsif bedroomFunc == 3
		inputTime += 30*$minute + rand($minute*30)
	end

	#exit bathroom, another hallwayscan after random amount of time in bath ( ~5min)
	#puts "At return --->>>> inputTime: " + inputTime.strftime("%I:%M:%S%p %m/%d/%y")
	#puts "Now going from " + $tagID_bathroom1 + " to " + destination
	#inputTime =  
	#puts "inputTime: " + inputTime.inspect
	return houseTrip(inputTime, submitBedroomID, destination)
end

####################################
#########Trip in house##############
####################################
def houseTrip(inputTime, source, destination)
	puts "Going from " + source + " to " + destination
	$currentLocation = destination
	case destination

	when source
		return inputTime

	when "Bathroom-001"
		case source
		when "Kitchen-001"
			inputTime = houseTrip(inputTime, "Kitchen-001", "LivingRoom-001")
			return houseTrip(inputTime, "LivingRoom-001", "Bathroom-001")
		when "Bedroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bathroom1, inputTime)
			return inputTime
		when "Bedroom-002"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bathroom1, inputTime)
			return inputTime
		when "LivingRoom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bathroom1, inputTime)
			return inputTime
		end

	when "Bedroom-001"
		case source
		when "Kitchen-001"
			inputTime = houseTrip(inputTime, "Kitchen-001", "LivingRoom-001")
			return houseTrip(inputTime, "LivingRoom-001", "Bedroom-001")
		when "Bathroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bedroom1, inputTime)
			return inputTime
		when "Bedroom-002"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bedroom1, inputTime)
			return inputTime
		when "LivingRoom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bedroom1, inputTime)
			return inputTime
		end

	when "Bedroom-002"
		case source
		when "Kitchen-001"
			inputTime = houseTrip(inputTime, "Kitchen-001", "LivingRoom-001")
			return houseTrip(inputTime, "LivingRoom-001", "Bedroom-002")
		when "Bathroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bedroom2, inputTime)
			return inputTime
		when "Bedroom-002"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bedroom2, inputTime)
			return inputTime
		when "LivingRoom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_bedroom2, inputTime)
			return inputTime
		end

	when "Kitchen-001"
		case source
		when "LivingRoom-001"
			inputTime += $walkingConstant
			submitTag($tagID_kitchen, inputTime)
			return inputTime
		when "Bathroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return houseTrip(inputTime, $tagID_lr, $tagID_kitchen)
		when "Bedroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return houseTrip(inputTime, $tagID_lr, $tagID_kitchen)
		when "Bedroom-002"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return houseTrip(inputTime, $tagID_lr, $tagID_kitchen)
		end

	when "LivingRoom-001"
		case source
		when "Kitchen-001"
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return inputTime
		when "Bedroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return inputTime
		when "Bedroom-002"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return inputTime
		when "Bathroom-001"
			inputTime += $walkingConstant
			submitTag($tagID_hallway, inputTime)
			inputTime += $walkingConstant
			submitTag($tagID_lr, inputTime)
			return inputTime
		end

	else
		puts "houseTrip error"
	end
end

####################################
#######Main Day Loop################
####################################
$timeOfDay = Time.new()

def singleDayGen()

	
	wakeTime = $timeOfDay + ($hour*6) + rand($hour*2) + rand($minute * 60)
	bedTimeLimit = $timeOfDay + ($hour*21 + rand($minute*45))

	puts "Bed time limit: " + bedTimeLimit.strftime("%I:%M:%S%p %m/%d/%y")

	#Random Nighttime bathroom visit from midnight to 4am, 25% chance to occur on any given night
	if rand(100) > 75
		puts "Uh oh! Midnight incontinence strikes!"
		$timeOfDay = bathroomVisit($timeOfDay + rand($hour*4), 1, 1, $tagID_bedroom1, $tagID_bedroom1)
	end

	#wakeup time
	$timeOfDay = wakeTime

	#random bedtime
	bedTimeActual = $timeOfDay + ($hour * 13) + rand($hour*1 + (30 * $minute))

	puts "Wake time actual: " + $timeOfDay.strftime("%I:%M:%S%p %m/%d/%y")

	while(bedTimeActual > bedTimeLimit) 
		bedTimeActual -= 30*$minute
	end 

	puts "Bed time actual: " + bedTimeActual.strftime("%I:%M:%S%p %m/%d/%y")
	
	#leaving bedroom in morning, go to bathroom most days (~90%)
	if rand(100) > 10
		#shower or not (~%80 chance to shower)
		if rand(100) > 20
			#getting out of bed for shower
			$timeOfDay += (2*$minute) + rand($minute*3)
			puts "Shower at " + $timeOfDay.strftime("%I:%M:%S%p %m/%d/%y")
			$timeOfDay = bathroomVisit($timeOfDay, 1, 3, $tagID_bedroom1, $tagID_bedroom1)
			#getting dressed
			$timeOfDay += (2*$minute) + rand($minute*3)
		elsif
			#getting out of bed / dressed
			$timeOfDay += (2*$minute) + rand($minute*6)
			puts "#2 at " + $timeOfDay.strftime("%I:%M:%S%p %m/%d/%y") 
			$timeOfDay = bathroomVisit($timeOfDay, 1, 2, $tagID_bedroom1, $tagID_bathroom1)
		end
	else
		puts "We'll skip shower for today"
	end

	#eat breakfast, 100% chance to occur after waking, 30% chance to eat in living room
	$hungerLevel = 0
	if rand(100) > 30
		puts "Eating breakfast in the kitchen today"
		$timeOfDay = kitchenVisit($timeOfDay, 3, $tagID_bedroom1, $tagID_kitchen)
	else
		puts "Eating breakfast in the living room today"
		$timeOfDay = kitchenVisit($timeOfDay, 3, $tagID_bedroom1, $tagID_lr)
	end

	while($timeOfDay < bedTimeActual)
		#puts "Now " + $timeOfDay.strftime("%I:%M:%S%p %m/%d/%y")

		lrFunc = 1 + rand(3)
		brFunc = 1 + rand(3)
		middayRandom = rand(100)

		if $hungerLevel > 70
			puts "Hunger strikes at " + $timeOfDay.inspect
			$timeOfDay = kitchenVisit($timeOfDay, 3, $currentLocation, $tagID_lr)
			$timeOfDay = bathroomVisit($timeOfDay, 1, 2, $currentLocation, $tagID_lr)
		end

		case middayRandom
		when 80..100 
			$timeOfDay = bathroomVisit($timeOfDay, 1, brFunc, $currentLocation, $tagID_lr)
		when 55..79
			$timeOfDay = bedroomVisit($timeOfDay, 1, 3, $currentLocation, $tagID_lr)
		when 30..54
			$timeOfDay = bedroomVisit($timeOfDay, 2, 3, $currentLocation, $tagID_lr)
		else
			$timeOfDay = livingRoomVisit($timeOfDay, lrFunc, $currentLocation, $tagID_lr)
		end

		#puts "Working so far: " + $timeOfDay.inspect
		#$timeOfDay = bathroomVisit($timeOfDay, 1, brFunc, $currentLocation, $tagID_lr)
		if $hungerLevel < 50
			$hungerLevel += 10 + rand(20)
		else
			$hungerLevel += 20 + rand(2)*30
		end

		#printHour = $timeOfDay
		#printHourplus = $timeOfDay + $hour
		#puts "adding hour from " + printHour.strftime("%I:%M:%S%p %m/%d/%y") + " to " + printHourplus.strftime("%I:%M:%S%p %m/%d/%y")
		if($timeOfDay < bedTimeActual)
			$timeOfDay += $hour
		end

	end

	puts "Going to sleep at around" + bedTimeActual.strftime("%I:%M:%S%p %m/%d/%y")
	$timeofDay = bathroomVisit($timeOfDay, 1, 1, $currentLocation, $tagID_bedroom1)

	##########################################

	#random movement between kitchen, living room, bathroom

	#five bathroom trips a day

	puts " "


end

#######Main loop ##########
#loops through the week
$numDays = $numDays.to_i
$numDays.times do |i|
	currentTime = Time.new()
	startDay = currentTime - $week
	
	dayConstant = i * ($day)

	#Day starts at midnight 
	$timeOfDay = startDay + dayConstant
	puts "=========================="
	puts "Day " + (i+1).inspect
	puts "=========================="
	#puts "year: " + $timeOfDay.year.inspect + " month: " + $timeOfDay.month.inspect + " day: " + $timeOfDay.day.inspect
	#puts "start time: " + $timeOfDay.inspect

	singleDayGen()
	#submitTag("test", Time.new(2015,2,18))
end

puts $count.inspect + " tags entered into DB"