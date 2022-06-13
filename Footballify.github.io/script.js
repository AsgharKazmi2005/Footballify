

//Order of Leagues
var desiredOrder = [
    1, 2, 3, 848, 4, 5, 6, 7, 9, 10, 29, 30, 31, 32, 33, 34, 36, 39, 45, 48, 140, 142, 135, 137, 78, 81, 61, 65, 66, 88, 94, 96, 253, 203, 262, 179, 185,
    144, 188, 169, 11, 13, 40, 41, 42, 43, 235, 207, 218, 141, 136, 333, 307, 197, 62, 79, 80, 128, 130, 292, 98, 101, 103, 106, 113, 119, 283, 71, 73,
    265, 239, 211, 89,
];

//Derive day based on UTC 
const isoStr = new Date().toISOString().slice(0,10);

//Pull API Data for UTC
var run = async () => {
    const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${isoStr}`, {
        headers: {
            'X-RapidAPI-Host': "v3.football.api-sports.io",
			"X-RapidAPI-Key": "e54f3d3972ca8251c1259694b49948de"
        }, 
    });
    //Parse JSON
    const json = (await res.json())?.response;
    //Map desiredOrder onto API Call
    const ordered = desiredOrder.map((id) => json.filter(({ league }) => league?.id === id));
    //Remove any Null Values
    const filtered = ordered.filter(e => e.length);

    //arrLeagues created to avoid duplicate leagues
    let arrLeagues = [];
    console.log(filtered)
    //Loop through leagues
    $('.parentDiv').remove();
	for (i = 0; i < filtered.length-1; i++) {
       //Loop through games of Leagues
       for (x=0; x<filtered[i].length;x++){
        //Create Parent Div For Data
        let parent = document.createElement("div")
        parent.className = 'parentDiv'
        
        //League Duplication not allowed
        if (arrLeagues.includes(filtered[i][x].league.id)) {

        } else {
        arrLeagues.push(filtered[i][x].league.id)

        //League Name
        let league = document.createElement("div")
        league.className = 'league'

        if (filtered[i][x].league.flag) {
        league.innerHTML = filtered[i][x].league.name + `<img class='flag' src=${filtered[i][x].league.flag}>`
        } else {
        league.innerHTML = filtered[i][x].league.name + `<img class='flag' src=${filtered[i][x].league.logo}>`  
        }
        parent.appendChild(league)
        }

        //Home Container
        let child1 = document.createElement("div")
        child1.className = 'childDiv'


        let timeDiv = document.createElement("div")
        timeDiv.className = 'timeDiv'

        parent.appendChild(timeDiv)
        //Game Status
        let gameStatus = document.createElement("div")
        gameStatus.className = 'status'
        gameStatus.innerHTML = filtered[i][x].fixture.status.short
        timeDiv.appendChild(gameStatus)

        let gameTime = document.createElement("div")
        let gameTimeVar = String(filtered[i][x].fixture.date).slice(11,16)
        gameTime.className = 'gameTime'
        gameTime.innerHTML = gameTimeVar
        timeDiv.appendChild(gameTime)

        parent.appendChild(timeDiv)


        //Home Name
        let homeTeamName = document.createElement("div")
        homeTeamName.className = 'team1'
        homeTeamName.innerHTML = filtered[i][x].teams.home.name
        parent.appendChild(homeTeamName)
      
        let timerOrigin = document.createElement("div")
        timerOrigin.className = 'timer'
        timerOrigin.innerHTML = filtered[i][x].fixture.timestamp;

        let venue = document.createElement("div")
        venue.className = 'venue'
        venue.innerHTML = filtered[i][x].fixture.venue.name;

        let city = document.createElement("div")
        city.className = 'city'
        city.innerHTML = filtered[i][x].fixture.venue.city;

        let referee = document.createElement("div")
        referee.className = 'referee'
        referee.innerHTML = filtered[i][x].fixture.referee;

        let fixtureId = document.createElement("div")
        fixtureId.className = 'fixtureId'
        fixtureId.innerHTML = filtered[i][x].fixture.id;

        let country = document.createElement("div")
        country.className = 'country'
        country.innerHTML = filtered[i][x].league.country;

        let homeTeamLogo = document.createElement("img")
        homeTeamLogo.className = 'logo1'
        homeTeamLogo.setAttribute("src",filtered[i][x].teams.home.logo)

        let awayTeamLogo = document.createElement("img")
        awayTeamLogo.className = 'logo1'
        awayTeamLogo.setAttribute("src",filtered[i][x].teams.away.logo)

        //Home Score
        let homeTeamScore = document.createElement("div")
        homeTeamScore.className = 'score1'
        parent.appendChild(homeTeamScore)

        //Away Container
        let child2 = document.createElement("div")
        child2.className = 'childDiv'

        //Away Name
        let awayTeamName = document.createElement("div")
        awayTeamName.className = 'team2'
        awayTeamName.innerHTML = filtered[i][x].teams.away.name
        parent.appendChild(awayTeamName)

        //Away Score
        let awayTeamScore = document.createElement("div")
        awayTeamScore.className = 'score2'
        parent.appendChild(awayTeamScore)
        
        //Push all Data to DOM

        var runLineups = async (idParameter) => {
            const lin = await fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${idParameter}`, {
        headers: {
            'X-RapidAPI-Host': 'v3.football.api-sports.io',
            'X-RapidAPI-Key': 'e54f3d3972ca8251c1259694b49948de'
        },
        });
        const lineupData = (await lin.json())?.response;
        console.log(lineupData)

        $('lineupC').remove();
        $('subsC').remove();
        let lineupC = document.createElement('div')
        lineupC.className='lineupC';

        let subsC = document.createElement('div')
        subsC.className='lineupC';

        let CoachC = document.createElement('div')
        CoachC.className='lineupC';

        let textstart11 = document.createElement('div')
        textstart11.className = 'startEleven'

        //Starting 11

        if (lineupData.length===0) {
            textstart11.innerHTML = 'Lineups Not Available'
            document.querySelector('.sideScoreDiv').appendChild(textstart11)
            $(textstart11).hide().fadeIn(500);
        } else {

            if (lineupData[0].formation) {
            textstart11.innerHTML = 'Starting XI'
            document.querySelector('.sideScoreDiv').appendChild(textstart11)
            $(textstart11).hide().fadeIn(500);
    
            for (let d=0; d<=lineupData[0].startXI.length-1; d++) {
                
                let lineupParentHome = document.createElement('div')
                lineupParentHome.classList = "lineupParentHome"
                lineupParentHome.innerHTML=lineupData[0].startXI[d].player.name 
                document.querySelector('.sideScoreDiv').appendChild(lineupParentHome)
                lineupC.appendChild(lineupParentHome)
                $(lineupParentHome).hide().fadeIn(500);
               
                let lineupParentAway = document.createElement('div')
                lineupParentAway.classList = "lineupParentAway"
                lineupParentAway.innerHTML=lineupData[1].startXI[d].player.name
                lineupC.appendChild(lineupParentAway)
                $(lineupParentAway).hide().fadeIn(500);
                }

            for (let d=0; d<=lineupData[0].substitutes.length-1; d++) {
                
    
                let subsHome = document.createElement('div')
                subsHome.classList = "lineupParentHome"
                subsHome.innerHTML=lineupData[0].substitutes[d].player.name
                document.querySelector('.sideScoreDiv').appendChild(subsHome)
                subsC.appendChild(subsHome)
                $(subsHome).hide().fadeIn(500);
                
                if (lineupData[1].substitutes.length-1>=d) {
                let subsAway = document.createElement('div')
                subsAway.classList = "lineupParentAway"
                subsAway.innerHTML=lineupData[1].substitutes[d].player.name
                subsC.appendChild(subsAway)
                $(subsAway).hide().fadeIn(500);
                }

            }

            let CoachHome = document.createElement('div')
                CoachHome.classList = "lineupParentHome"
                CoachHome.innerHTML=lineupData[0].coach.name
                document.querySelector('.sideScoreDiv').appendChild(CoachHome)
                CoachC.appendChild(CoachHome)
                $(CoachHome).hide().fadeIn(500);

            let CoachAway = document.createElement('div')
                CoachAway.classList = "lineupParentAway"
                CoachAway.innerHTML=lineupData[1].coach.name
                document.querySelector('.sideScoreDiv').appendChild(CoachAway)
                CoachC.appendChild(CoachAway)
                $(CoachAway).hide().fadeIn(500);

                document.querySelector('.sideScoreDiv').appendChild(lineupC)

                let substitutes = document.createElement('div')
                substitutes.className = 'startEleven'
                substitutes.innerHTML="Substitutes"
                document.querySelector('.sideScoreDiv').appendChild(substitutes)
                $(substitutes).hide().fadeIn(500);
            
                document.querySelector('.sideScoreDiv').appendChild(subsC)
            
                let coaches = document.createElement('div')
                coaches.className = 'startEleven'
                coaches.innerHTML="Coaches"
                document.querySelector('.sideScoreDiv').appendChild(coaches)
                $(coaches).hide().fadeIn(500);
            
                document.querySelector('.sideScoreDiv').appendChild(CoachC)

            } else {
            textstart11.innerHTML = 'Lineups Not Available'
            document.querySelector('.sideScoreDiv').appendChild(textstart11)
            $(textstart11).hide().fadeIn(500);

        }

    }

    }

    var runStats = async (idParameter) => {
        
        const stats = await fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${idParameter}`, {
    headers: {
        'X-RapidAPI-Host': 'v3.football.api-sports.io',
        'X-RapidAPI-Key': 'e54f3d3972ca8251c1259694b49948de'
    },
    })
    const statsData = (await stats.json())?.response;
    console.log(statsData)

    $('statsC').remove();
    let statText = document.createElement('div')
    statText.className = 'fixtureInfo'
    statText.innerHTML = 'Statistics'
    document.querySelector('.sideScoreDiv').appendChild(statText)
    $(statText).hide().fadeIn(500);

    let statsC = document.createElement('div')
        statsC.className='statsC';
    for (let k=0; k<=statsData[0].statistics.length-1; k++) {
                
        let homeStats = document.createElement('div')
        homeStats.classList = "homeStats"
        homeStats.innerHTML=statsData[0].statistics[k].value
        if (statsData[0].statistics[k].value) {

        } else {
            homeStats.innerHTML=0
        }

        
        statsC.appendChild(homeStats)
        $(homeStats).hide().fadeIn(500);
       
        let statName = document.createElement('div')
        statName.classList = "statName"
        statName.innerHTML=statsData[0].statistics[k].type
        statsC.appendChild(statName)
        $(statName).hide().fadeIn(500);

        let awayStats = document.createElement('div')
        awayStats.classList = "awayStats"
        awayStats.innerHTML=statsData[1].statistics[k].value
        if (statsData[1].statistics[k].value) {

        } else {
            awayStats.innerHTML=0
        }
        
        statsC.appendChild(awayStats)
        $(awayStats).hide().fadeIn(500);

        document.querySelector('.sideScoreDiv').appendChild(statsC)

        }
};

var runEvents = async (idParameter, home) => {
    const events = await fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${idParameter}`, {
headers: {
    'X-RapidAPI-Host': 'v3.football.api-sports.io',
    'X-RapidAPI-Key': 'e54f3d3972ca8251c1259694b49948de'
},
})
const eventsData = (await events.json())?.response;
console.log(eventsData)

let eventsC = document.createElement('div')
        eventsC.className='eventsC';

let homeTm=home

let eventsText = document.createElement('div')
eventsText.className = 'fixtureInfo'
eventsText.innerHTML = 'Events'
document.querySelector('.sideScoreDiv').appendChild(eventsText)
$(eventsText).hide().fadeIn(500);

for (let d=eventsData.length-1; d>=0; d--) {
                
    let eventOccured = document.createElement('div')
    eventOccured.classList = "lineupParentHome"

if (eventsData[d].time.extra>0) {
    if (homeTm==eventsData[d].team.name) {
        console.log('homew')
        eventOccured.classList = "homeEvent"
        if (eventsData[d].detail=="Normal Goal") {
            if (eventsData[d].assist.name) { 
        eventOccured.innerHTML=`<img class='ball' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">` + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'  " + eventsData[d].player.name + `<h1 class="light"> Assist: ${eventsData[d].assist.name}</h1>`
            } else {
        eventOccured.innerHTML=`<img class='ball' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">` + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'  " + eventsData[d].player.name
            }
        } else if (eventsData[d].detail=="Penalty") {
            eventOccured.innerHTML=`<svg class="pen" width="20" height="20" viewBox="0 0 1024 1024" fill="#52b030" style="min-width: 16px; display: inline-block;"><title>Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 
    
        } else if (eventsData[d].type=="Var") {
            eventOccured.innerHTML=`<svg class="var" width="18" height="18" viewBox="0 0 32 32"><title>VAR decision</title><path d="M32,4.5H0v20.4h9v2.6h14v-2.6h9V4.5z M30.3,23.1H1.7V6.3h28.5V23.1z"></path><path d="M7.4,17.1l2.3-7.5h2.3l-3.5,10H6.3l-3.5-10h2.3L7.4,17.1z"></path><path d="M17.4,17.5h-3.6l-0.7,2.1H11l3.7-10h1.9l3.7,10h-2.2L17.4,17.5z M14.4,15.9h2.5l-1.3-3.7 L14.4,15.9z"></path><path d="M24.7,15.9H23v3.6H21v-10h3.7c1.2,0,2.1,0.3,2.7,0.8s1,1.3,1,2.2c0,0.7-0.1,1.2-0.4,1.7 c-0.3,0.5-0.7,0.8-1.3,1.1l2.2,4.1v0.1h-2.2L24.7,15.9z M23,14.3h1.7c0.5,0,0.9-0.1,1.2-0.4s0.4-0.6,0.4-1.1c0-0.5-0.1-0.8-0.4-1.1 c-0.3-0.3-0.7-0.4-1.2-0.4H23V14.3z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name + `<h1 class='light'>${eventsData[d].detail} </h1>`
    
        } else if (eventsData[d].detail=="Missed Penalty") {
            eventOccured.innerHTML=`<svg class="penMiss" width="20" height="20" viewBox="0 0 1024 1024" fill="red" style="min-width: 16px; display: inline-block;"><title>Missed Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 
    
        } else if (eventsData[d].detail=="Own Goal") {
            eventOccured.innerHTML=`<svg class="og" width="16" height="16" viewBox="0 0 1024 1024" style="min-width: 16px;display: inline-block;/* fill: aqua; */"><title>Own Goal</title><path d="M787.968 236.064c-152.16-152.16-399.744-152.16-551.936 0-152.16 152.128-152.16 399.776 0 551.936 152.16 152.096 399.744 152.16 551.936 0 152.16-152.16 152.16-399.808 0-551.936zM734.592 734.624c-99.040 98.912-248.096 118.048-366.4 57.376l28.064-66.144-98.080-98.112-66.208 28.064c-60.608-118.368-41.568-267.36 57.44-366.4 98.976-98.912 247.872-118.048 366.272-57.44l-27.776 65.376 98.144 98.144 65.664-27.808c61.056 118.432 42.016 267.744-57.12 366.944zM549.632 549.664l-32.608 150.912 127.2 49.216 105.6-105.6-50.72-128.576zM284.576 382.656l52.544 124.928 144.256-26.176 26.688-143.776-125.472-52.992z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 
    
        } else if (eventsData[d].detail=="Yellow Card") {
            if (eventsData[d].comments) {
                eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'  " + eventsData[d].player.name  + `<h1 class='light'>${eventsData[d].comments} </h1>`

            } else {
                eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'  " + eventsData[d].player.name 

            }

        } else if (eventsData[d].type=="subst") {
        eventOccured.innerHTML=`<img class='sub' src="https://media.istockphoto.com/vectors/green-recycle-sign-icon-symbol-on-white-background-triangular-eco-vector-id1209231674?k=20&m=1209231674&s=612x612&w=0&h=OQumbbblFyt8Z2aKRjF2dYeKCsiiLbiR2zi9lW1Jxlg=">` + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'  " + eventsData[d].player.name + `<h1 class="light"> Out: ${eventsData[d].assist.name}</h1>`
        } else if (eventsData[d].detail=="Red Card") {
            if (eventsData[d].comments) {
            
            eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'  " + eventsData[d].player.name + `<h1 class='light'>${eventsData[d].comments} </h1>`
            } else {
            eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name

            }
        }
} else {
    eventOccured.classList = "awayEvent"
    if (eventsData[d].detail=="Normal Goal") {
        if (eventsData[d].assist.name) { 
            eventOccured.innerHTML= `<h1 class="light"> Assist: ${eventsData[d].assist.name}</h1>` + eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra)+ "'" + `<img class='ballFloat' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">`
                } else {
                    eventOccured.innerHTML= eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<img class='ballFloat' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">`
                }
            } else if (eventsData[d].detail=="Penalty") {
                eventOccured.innerHTML=  eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="penFloat" width="20" height="20" viewBox="0 0 1024 1024" fill="#52b030" style="min-width: 16px; display: inline-block;"><title>Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>`
        
            } else if (eventsData[d].type=="Var") {
                eventOccured.innerHTML=  `<h1 class='light'>${eventsData[d].detail} </h1>`+ eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="varRight" width="18" height="18" viewBox="0 0 32 32"><title>VAR decision</title><path d="M32,4.5H0v20.4h9v2.6h14v-2.6h9V4.5z M30.3,23.1H1.7V6.3h28.5V23.1z"></path><path d="M7.4,17.1l2.3-7.5h2.3l-3.5,10H6.3l-3.5-10h2.3L7.4,17.1z"></path><path d="M17.4,17.5h-3.6l-0.7,2.1H11l3.7-10h1.9l3.7,10h-2.2L17.4,17.5z M14.4,15.9h2.5l-1.3-3.7 L14.4,15.9z"></path><path d="M24.7,15.9H23v3.6H21v-10h3.7c1.2,0,2.1,0.3,2.7,0.8s1,1.3,1,2.2c0,0.7-0.1,1.2-0.4,1.7 c-0.3,0.5-0.7,0.8-1.3,1.1l2.2,4.1v0.1h-2.2L24.7,15.9z M23,14.3h1.7c0.5,0,0.9-0.1,1.2-0.4s0.4-0.6,0.4-1.1c0-0.5-0.1-0.8-0.4-1.1 c-0.3-0.3-0.7-0.4-1.2-0.4H23V14.3z"></path></svg>`
        
            } else if (eventsData[d].detail=="Missed Penalty") {
                eventOccured.innerHTML=  eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="penMissFloat" width="20" height="20" viewBox="0 0 1024 1024" fill="red" style="min-width: 16px; display: inline-block;"><title>Missed Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>`
        
            } else if (eventsData[d].detail=="Own Goal") {
                eventOccured.innerHTML=  eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="og" width="16" height="16" viewBox="0 0 1024 1024" fill="#52b030" style="min-width: 16px;display: inline-block;"><title>Own Goal</title><path d="M787.968 236.064c-152.16-152.16-399.744-152.16-551.936 0-152.16 152.128-152.16 399.776 0 551.936 152.16 152.096 399.744 152.16 551.936 0 152.16-152.16 152.16-399.808 0-551.936zM734.592 734.624c-99.040 98.912-248.096 118.048-366.4 57.376l28.064-66.144-98.080-98.112-66.208 28.064c-60.608-118.368-41.568-267.36 57.44-366.4 98.976-98.912 247.872-118.048 366.272-57.44l-27.776 65.376 98.144 98.144 65.664-27.808c61.056 118.432 42.016 267.744-57.12 366.944zM549.632 549.664l-32.608 150.912 127.2 49.216 105.6-105.6-50.72-128.576zM284.576 382.656l52.544 124.928 144.256-26.176 26.688-143.776-125.472-52.992z"></path></svg>`
        
            } else if (eventsData[d].detail=="Yellow Card") {
                if (eventsData[d].comments) {
                eventOccured.innerHTML= `<h1 class='light'>${eventsData[d].comments} </h1>` + eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`
                } else {
                eventOccured.innerHTML= eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`
                }
            } else if (eventsData[d].type=="subst") {
            eventOccured.innerHTML= `<h1 class="light"> Out: ${eventsData[d].assist.name}</h1>` + eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'"+  `<img class='subFloat' src="https://media.istockphoto.com/vectors/green-recycle-sign-icon-symbol-on-white-background-triangular-eco-vector-id1209231674?k=20&m=1209231674&s=612x612&w=0&h=OQumbbblFyt8Z2aKRjF2dYeKCsiiLbiR2zi9lW1Jxlg=">`
            } else if (eventsData[d].detail=="Red Card") {
                if (eventsData[d].comments) {
            eventOccured.innerHTML= `<h1 class='light'>${eventsData[d].comments} </h1>` + eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`
            } else {
            eventOccured.innerHTML= eventsData[d].player.name + " " + Number(eventsData[d].time.elapsed+eventsData[d].time.extra) + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`

            }
        }
        }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} else {
    if (homeTm==eventsData[d].team.name) {
        eventOccured.classList = "homeEvent"
        if (eventsData[d].detail=="Normal Goal") {
            if (eventsData[d].assist.name) { 
        eventOccured.innerHTML=`<img class='ball' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name + `<h1 class="light"> Assist: ${eventsData[d].assist.name}</h1>`
            } else {
        eventOccured.innerHTML=`<img class='ball' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name
            }
        } else if (eventsData[d].detail=="Penalty") {
            eventOccured.innerHTML=`<svg class="pen" width="20" height="20" viewBox="0 0 1024 1024" fill="#52b030" style="min-width: 16px; display: inline-block;"><title>Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 
    
        } else if (eventsData[d].type=="Var") {
            eventOccured.innerHTML=`<svg class="var" width="18" height="18" viewBox="0 0 32 32"><title>VAR decision</title><path d="M32,4.5H0v20.4h9v2.6h14v-2.6h9V4.5z M30.3,23.1H1.7V6.3h28.5V23.1z"></path><path d="M7.4,17.1l2.3-7.5h2.3l-3.5,10H6.3l-3.5-10h2.3L7.4,17.1z"></path><path d="M17.4,17.5h-3.6l-0.7,2.1H11l3.7-10h1.9l3.7,10h-2.2L17.4,17.5z M14.4,15.9h2.5l-1.3-3.7 L14.4,15.9z"></path><path d="M24.7,15.9H23v3.6H21v-10h3.7c1.2,0,2.1,0.3,2.7,0.8s1,1.3,1,2.2c0,0.7-0.1,1.2-0.4,1.7 c-0.3,0.5-0.7,0.8-1.3,1.1l2.2,4.1v0.1h-2.2L24.7,15.9z M23,14.3h1.7c0.5,0,0.9-0.1,1.2-0.4s0.4-0.6,0.4-1.1c0-0.5-0.1-0.8-0.4-1.1 c-0.3-0.3-0.7-0.4-1.2-0.4H23V14.3z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name + `<h1 class='light'>${eventsData[d].detail} </h1>`
    
        } else if (eventsData[d].detail=="Missed Penalty") {
            eventOccured.innerHTML=`<svg class="penMiss" width="20" height="20" viewBox="0 0 1024 1024" fill="red" style="min-width: 16px; display: inline-block;"><title>Missed Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 
    
        } else if (eventsData[d].detail=="Own Goal") {
            eventOccured.innerHTML=`<svg class="og" width="16" height="16" viewBox="0 0 1024 1024" style="min-width: 16px;display: inline-block;/* fill: aqua; */"><title>Own Goal</title><path d="M787.968 236.064c-152.16-152.16-399.744-152.16-551.936 0-152.16 152.128-152.16 399.776 0 551.936 152.16 152.096 399.744 152.16 551.936 0 152.16-152.16 152.16-399.808 0-551.936zM734.592 734.624c-99.040 98.912-248.096 118.048-366.4 57.376l28.064-66.144-98.080-98.112-66.208 28.064c-60.608-118.368-41.568-267.36 57.44-366.4 98.976-98.912 247.872-118.048 366.272-57.44l-27.776 65.376 98.144 98.144 65.664-27.808c61.056 118.432 42.016 267.744-57.12 366.944zM549.632 549.664l-32.608 150.912 127.2 49.216 105.6-105.6-50.72-128.576zM284.576 382.656l52.544 124.928 144.256-26.176 26.688-143.776-125.472-52.992z"></path></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 
    
        } else if (eventsData[d].detail=="Yellow Card") {
            if (eventsData[d].comments) {
                eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name  + `<h1 class='light'>${eventsData[d].comments} </h1>`

            } else {
                eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name 

            }

        } else if (eventsData[d].type=="subst") {
        eventOccured.innerHTML=`<img class='sub' src="https://media.istockphoto.com/vectors/green-recycle-sign-icon-symbol-on-white-background-triangular-eco-vector-id1209231674?k=20&m=1209231674&s=612x612&w=0&h=OQumbbblFyt8Z2aKRjF2dYeKCsiiLbiR2zi9lW1Jxlg=">` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name + `<h1 class="light"> Out: ${eventsData[d].assist.name}</h1>`
        } else if (eventsData[d].detail=="Red Card") {
            if (eventsData[d].comments) {
            
            eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name + `<h1 class='light'>${eventsData[d].comments} </h1>`
            } else {
            eventOccured.innerHTML=`<svg class="card" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>` + eventsData[d].time.elapsed + "'  " + eventsData[d].player.name

            }
        }
} else {
    eventOccured.classList = "awayEvent"
    if (eventsData[d].detail=="Normal Goal") {
        if (eventsData[d].assist.name) { 
            eventOccured.innerHTML= `<h1 class="light"> Assist: ${eventsData[d].assist.name}</h1>` + eventsData[d].player.name + " " + eventsData[d].time.elapsed+ "'" + `<img class='ballFloat' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">`
                } else {
                    eventOccured.innerHTML= eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<img class='ballFloat' src="https://www.citypng.com/public/uploads/small/11649467416xzjfid709wwfnn4b4minvcmsdpiyjrajom2djrhvdh5r1fybjfrf2rsp7vq2bc6ujsij9nsb9jfznh2pvoofx8uziapv9ekhjexe.png">`
                }
            } else if (eventsData[d].detail=="Penalty") {
                eventOccured.innerHTML=  eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="penFloat" width="20" height="20" viewBox="0 0 1024 1024" fill="#52b030" style="min-width: 16px; display: inline-block;"><title>Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>`
        
            } else if (eventsData[d].type=="Var") {
                eventOccured.innerHTML= `<h1 class='light'>${eventsData[d].detail} </h1>`+ eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="varRight" width="18" height="18" viewBox="0 0 32 32"><title>VAR decision</title><path d="M32,4.5H0v20.4h9v2.6h14v-2.6h9V4.5z M30.3,23.1H1.7V6.3h28.5V23.1z"></path><path d="M7.4,17.1l2.3-7.5h2.3l-3.5,10H6.3l-3.5-10h2.3L7.4,17.1z"></path><path d="M17.4,17.5h-3.6l-0.7,2.1H11l3.7-10h1.9l3.7,10h-2.2L17.4,17.5z M14.4,15.9h2.5l-1.3-3.7 L14.4,15.9z"></path><path d="M24.7,15.9H23v3.6H21v-10h3.7c1.2,0,2.1,0.3,2.7,0.8s1,1.3,1,2.2c0,0.7-0.1,1.2-0.4,1.7 c-0.3,0.5-0.7,0.8-1.3,1.1l2.2,4.1v0.1h-2.2L24.7,15.9z M23,14.3h1.7c0.5,0,0.9-0.1,1.2-0.4s0.4-0.6,0.4-1.1c0-0.5-0.1-0.8-0.4-1.1 c-0.3-0.3-0.7-0.4-1.2-0.4H23V14.3z"></path></svg>`
        
            } else if (eventsData[d].detail=="Missed Penalty") {
                eventOccured.innerHTML=  eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="penMissFloat" width="20" height="20" viewBox="0 0 1024 1024" fill="red" style="min-width: 16px; display: inline-block;"><title>Missed Penalty</title><path d="M328.96 488.928c-100.928 100.96-100.928 265.216 0 366.176s265.216 100.96 366.080 0c100.928-100.96 100.928-265.216 0-366.176-100.896-100.864-265.152-100.864-366.080 0zM653.856 813.728c-62.976 63.008-149.28 75.136-224.576 36.48l16.32-39.232-63.68-63.776-39.392 16.32c-38.592-75.328-26.4-170.176 36.608-233.184 63.008-62.944 149.248-75.168 224.576-36.544l-16.128 38.784 63.744 63.808 38.944-16.192c38.784 75.296 26.72 170.4-36.416 233.536zM526.144 686.144l-21.664 100.16 84.416 32.608 70.048-69.984-33.6-85.408zM369.504 594.528l34.784 82.88 95.712-17.376 17.664-95.36-83.104-35.136zM116.352 162.912v349.088h93.12v-256h605.056v256h93.12v-349.088z"></path></svg>`
        
            } else if (eventsData[d].detail=="Own Goal") {
                eventOccured.innerHTML=  eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="og" width="16" height="16" viewBox="0 0 1024 1024" fill="#52b030" style="min-width: 16px;display: inline-block;"><title>Own Goal</title><path d="M787.968 236.064c-152.16-152.16-399.744-152.16-551.936 0-152.16 152.128-152.16 399.776 0 551.936 152.16 152.096 399.744 152.16 551.936 0 152.16-152.16 152.16-399.808 0-551.936zM734.592 734.624c-99.040 98.912-248.096 118.048-366.4 57.376l28.064-66.144-98.080-98.112-66.208 28.064c-60.608-118.368-41.568-267.36 57.44-366.4 98.976-98.912 247.872-118.048 366.272-57.44l-27.776 65.376 98.144 98.144 65.664-27.808c61.056 118.432 42.016 267.744-57.12 366.944zM549.632 549.664l-32.608 150.912 127.2 49.216 105.6-105.6-50.72-128.576zM284.576 382.656l52.544 124.928 144.256-26.176 26.688-143.776-125.472-52.992z"></path></svg>`
        
            } else if (eventsData[d].detail=="Yellow Card") {
                if (eventsData[d].comments) {
                eventOccured.innerHTML= `<h1 class='light'>${eventsData[d].comments} </h1>` + eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`
                } else {
                eventOccured.innerHTML= eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="#ffa500" style="margin-top: 3.3px;"><title>Yellow card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`
                }
            } else if (eventsData[d].type=="subst") {
            eventOccured.innerHTML= `<h1 class="light"> Out: ${eventsData[d].assist.name}</h1>` + eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'"+  `<img class='subFloat' src="https://media.istockphoto.com/vectors/green-recycle-sign-icon-symbol-on-white-background-triangular-eco-vector-id1209231674?k=20&m=1209231674&s=612x612&w=0&h=OQumbbblFyt8Z2aKRjF2dYeKCsiiLbiR2zi9lW1Jxlg=">`
            } else if (eventsData[d].detail=="Red Card") {
                if (eventsData[d].comments) {
            eventOccured.innerHTML= `<h1 class='light'>${eventsData[d].comments} </h1>` + eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`
            } else {
            eventOccured.innerHTML= eventsData[d].player.name + " " + eventsData[d].time.elapsed + "'" + `<svg class="cardFloat" width="14" height="13" viewBox="0 0 6 8" fill="red" style="margin-top: 3.3px;"><title>Red Card</title><rect x="0" y="0" width="7" height="8" rx="1" ry="1"></rect></svg>`

            }
        }
        }
    }
    eventsC.appendChild(eventOccured)
    $(eventOccured).hide().fadeIn(500);
    }
    document.querySelector('.sideScoreDiv').appendChild(eventsC)
}
                //Match Not Started or  Cancelled/Postponed or In Progress
    if (gameStatus.innerHTML == 'TBD' || gameStatus.innerHTML == 'PST' || gameStatus.innerHTML == 'NS' || gameStatus.innerHTML == '1H' || gameStatus.innerHTML == '2H' || gameStatus.innerHTML == 'ET' || gameStatus.innerHTML == 'INT' || gameStatus.innerHTML == 'HT' ){
                 
                                                               homeTeamName.classList.add('winner')
                                                               homeTeamScore.classList.add('winner')
                                                               awayTeamScore.classList.add('winner')
                                                               awayTeamName.classList.add('winner')

        //If Home Wins
        } else if (filtered[i][x].teams.home.winner == true) { homeTeamName.classList.add('winner') 
                                                               awayTeamName.classList.add('loser')
                                                               homeTeamScore.classList.add('winner')
                                                               awayTeamScore.classList.add('loser')

	    } else if (filtered[i][x].teams.away.winner == true) {
        //If Away Wins
                                                               awayTeamName.classList.add('winner')
                                                               homeTeamName.classList.add('loser')
                                                               awayTeamScore.classList.add('winner')
                                                               homeTeamScore.classList.add('loser')
        } else {
        //Draw
                                                               homeTeamName.classList.add('loser')
                                                               awayTeamName.classList.add('loser')
                                                               homeTeamScore.classList.add('loser')
                                                               awayTeamScore.classList.add('loser')
        }

        if (String(filtered[i][x].fixture.status.short) === 'NS') {homeTeamScore.innerHTML = 0;homeTeamScore.classList.add('hide');awayTeamScore.innerHTML = 0;awayTeamScore.classList.add('hide');
        } else if (String(filtered[i][x].fixture.status.short) === 'CANC') {homeTeamScore.classList.add('hide');homeTeamScore.innerHTML = 0;awayTeamScore.classList.add('hide');awayTeamScore.innerHTML = 0;gameStatus.innerHTML = 'NA';
        } else if (String(filtered[i][x].fixture.status.short) === 'HT') {homeTeamScore.classList.remove('hide');homeTeamScore.classList.add('live');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.classList.add('live');gameStatus.classList.add('live');awayTeamScore.innerHTML = filtered[i][x].goals.away;
        } else if (String(filtered[i][x].fixture.status.short) === 'PEN') {homeTeamScore.classList.remove('hide');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.innerHTML = filtered[i][x].goals.away;
        } else if (String(filtered[i][x].fixture.status.short) === 'PST') {homeTeamScore.classList.add('hide');homeTeamScore.innerHTML = 0;awayTeamScore.classList.add('hide');awayTeamScore.innerHTML = 0;
        } else if (String(filtered[i][x].fixture.status.short) === 'TBD') {homeTeamScore.classList.add('hide');homeTeamScore.innerHTML = 0;awayTeamScore.classList.add('hide');awayTeamScore.innerHTML = 0;
        } else if (String(filtered[i][x].fixture.status.short) === 'FT') {homeTeamScore.classList.remove('hide');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.innerHTML = filtered[i][x].goals.away;
        } else if (String(filtered[i][x].fixture.status.short) === 'AET') {homeTeamScore.classList.remove('hide');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.innerHTML = filtered[i][x].goals.away;
        } else if (String(filtered[i][x].fixture.status.short) === 'INT') {homeTeamScore.classList.remove('hide');homeTeamScore.classList.add('live');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.classList.add('live');gameStatus.classList.add('live');awayTeamScore.innerHTML = filtered[i][x].goals.away;
        } else if (String(filtered[i][x].fixture.status.short) == '1H') {homeTeamScore.classList.remove('hide');homeTeamScore.classList.add('live');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.classList.add('live');awayTeamScore.innerHTML = filtered[i][x].goals.away;gameStatus.classList.add('live');gameStatus.innerHTML = filtered[i][x].fixture.status.elapsed + "′";
        } else if (String(filtered[i][x].fixture.status.short) == 'ET') {homeTeamScore.classList.remove('hide');homeTeamScore.classList.add('live');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.classList.add('live');awayTeamScore.innerHTML = filtered[i][x].goals.away;gameStatus.classList.add('live');gameStatus.innerHTML = filtered[i][x].fixture.status.elapsed + "′";
        } else if (String(filtered[i][x].fixture.status.short) == '2H') {homeTeamScore.classList.remove('hide');homeTeamScore.classList.add('live');homeTeamScore.innerHTML = filtered[i][x].goals.home;awayTeamScore.classList.remove('hide');awayTeamScore.classList.add('live');awayTeamScore.innerHTML = filtered[i][x].goals.away;gameStatus.classList.add('live');gameStatus.innerHTML = filtered[i][x].fixture.status.elapsed + "′";} else {}
        
        // let clock = filtered[i][x].fixture.status.elapsed 
        parent.addEventListener("click", function(){

                $('.navbarMini').remove()
                $('.rightDiv').remove();      
                $('.rightDivScores').remove();
                $('.venue').remove();
                $('.city').remove();
                $('.referee').remove();
                $('.lineupC').remove();
                $('.lineupParentHome').remove();
                $('.lineupParentAway').remove();
                $('.startEleven').remove();
                $('.fixtureInfo').remove();
                $('.eventsC').remove();
                $('.homeEvent').remove();
                $('.awayEvent').remove();
          

            runEvents(fixtureId.innerHTML, homeTeamName.innerHTML);



           

            let teamNames = document.createElement("div")
            teamNames.className = 'rightDiv'

            let fixtureId2 = document.createElement("div")
            fixtureId2.className = 'fixtureId2'                                                         //
            fixtureId2.innerHTML = fixtureId.innerHTML;

            let homeTeamNameRightDiv = document.createElement("div")
            homeTeamNameRightDiv.className = 'fixturel'
            homeTeamNameRightDiv.innerHTML = homeTeamName.innerHTML + "-" 
            teamNames.appendChild(homeTeamNameRightDiv)

            let awayTeamNameRightDiv = document.createElement("div")
            awayTeamNameRightDiv.className = 'fixturer'
            awayTeamNameRightDiv.innerHTML = awayTeamName.innerHTML
            teamNames.appendChild(awayTeamNameRightDiv)

            let sideScore = document.createElement("div")
            sideScore.className = 'rightDivScores'

            let homeTeamLogoRightDiv = document.createElement("img")
            homeTeamLogoRightDiv.className = 'logo1'
            homeTeamLogoRightDiv.setAttribute("src", homeTeamLogo.getAttribute("src"))
            sideScore.appendChild(homeTeamLogoRightDiv)

            let timer = document.createElement("div")
            timer.className = 'timer'
            // Update the count down every 1 second
            var x = setInterval(function() {

            // Get today's date and time
            var now = new Date().getTime();
  
            // Find the distance between now and the count down date
            var distance = Number(String(timerOrigin.innerHTML)+"000") - now;
  
            // Time calculations for days, hours, minutes and seconds

            //Days are not displayed, only used to help calculate hours
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));


            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (days * 24);
            if (String(hours).length == 1) {
                hours= "0" + hours;
            }


            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            if (String(minutes).length == 1) {
                minutes= "0" + minutes;
            }


            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (String(seconds).length == 1) {
                seconds = "0" + seconds;
            }
                
            // Display the time
            if (Number(seconds)>=0){
            timer.innerHTML = hours + ":" + minutes + ":" + seconds;
            } else {
                if (gameStatus.innerHTML=="NS" || gameStatus.innerHTML=="TBD" || gameStatus.innerHTML=="NA" || gameStatus.innerHTML=="PST") {
                timer.innerHTML="-";
                } else if (distance < 0) {
                    let homeTeamScoreRightDiv = document.createElement("div")
                    homeTeamScoreRightDiv.className = 'fixtureScoreRight'
                    homeTeamScoreRightDiv.innerHTML = homeTeamScore.innerHTML + "-" 
        
                    let awayTeamScoreRightDiv = document.createElement("div")
                    awayTeamScoreRightDiv.className = 'fixtureScoreLeft'
                    awayTeamScoreRightDiv.innerHTML = awayTeamScore.innerHTML
                    
                    let gameTicker = document.createElement('div')
                    gameTicker.className="gameTicker"
                    

                    if (gameStatus.innerHTML=="FT" || gameStatus.innerHTML=="AWD") {
                        timer.innerHTML= homeTeamScoreRightDiv.innerHTML + awayTeamScoreRightDiv.innerHTML;   
                        timer.classList.remove('live') 
                    } else {
                        timer.innerHTML= homeTeamScoreRightDiv.innerHTML + awayTeamScoreRightDiv.innerHTML;   
                        timer.classList.add('live')
                  }
                }
            }
  
            // If the count down is finished, Display score
        
        }, .005);
            sideScore.appendChild(timer)

            let awayTeamLogoRightDiv = document.createElement("img")
            awayTeamLogoRightDiv.className = 'logo1'
            awayTeamLogoRightDiv.setAttribute("src", awayTeamLogo.getAttribute("src"))
            sideScore.appendChild(awayTeamLogoRightDiv)

            

            console.log(`${awayTeamName.innerHTML} Has Been Clicked`)


            document.querySelector('.sideScoreDiv').appendChild(teamNames)
            document.querySelector('.sideScoreDiv').appendChild(sideScore)

            
            $('.venue').remove();
            $('.city').remove();
            $('.referee').remove();
            $('.lineupC').remove();
            $('.lineupParentHome').remove();
            $('.lineupParentAway').remove();
            $('.startEleven').remove();
            $('.fixtureInfo').remove();
            $('.statsC').remove();
            $('.homeStats').remove();
            $('.awayStats').remove();
            $('.statName').remove();



            let navbarMini = document.createElement('nav')
            navbarMini.className='navbarMini';

            let eventsButton = document.createElement('button')
            eventsButton.className = 'eventsButton'
            eventsButton.innerHTML = "Events"
            navbarMini.appendChild(eventsButton)
            eventsButton.addEventListener("click", function(){ 
                eventsButton.classList.add("clicked")
                eventsButton.disabled=true
                lineupButton.disabled=false;
                statsButton.disabled=false;
                infoButton.disabled=false;
                statsButton.classList.remove("clicked")
                infoButton.classList.remove("clicked")
                lineupButton.classList.remove("clicked")
            
                $('.venue').remove();$('.city').remove();$('.referee').remove();$('.lineupC').remove();$('.lineupParentHome').remove();$('.lineupParentAway').remove();$('.startEleven').remove();     $('.fixtureInfo').remove();$('.statsC').remove();$('.homeStats').remove();$('.awayStats').remove();$('.statName').remove();$('.eventsC').remove();$('.homeEvent').remove();$('.awayEvent').remove();
                runEvents(fixtureId.innerHTML, homeTeamName.innerHTML)
            
            
             

            }) 

            let statsButton=document.createElement('button')
            statsButton.className='statsButton';
            statsButton.innerHTML='Statistics'
            navbarMini.appendChild(statsButton);
            statsButton.addEventListener("click", function(){ 
                statsButton.classList.add("clicked")
                statsButton.disabled=true
                lineupButton.disabled=false;
                eventsButton.disabled=false;
                infoButton.disabled=false;
                infoButton.classList.remove("clicked")
                eventsButton.classList.remove("clicked")
                lineupButton.classList.remove("clicked")
            
            
                $('.venue').remove();$('.city').remove();$('.referee').remove();$('.lineupC').remove();$('.lineupParentHome').remove();$('.lineupParentAway').remove();$('.startEleven').remove();     $('.fixtureInfo').remove();$('.statsC').remove();$('.homeStats').remove();$('.awayStats').remove();$('.statName').remove();$('.eventsC').remove();$('.homeEvent').remove();$('.awayEvent').remove();
                runStats(fixtureId.innerHTML)            
                
            
            })


            let lineupButton=document.createElement('button')
            lineupButton.className='lineupButton';
            lineupButton.innerHTML="Lineups"
            navbarMini.appendChild(lineupButton)
            lineupButton.addEventListener("click", function(){ 
                lineupButton.disabled=true;
                statsButton.disabled=false;
                eventsButton.disabled=false;
                infoButton.disabled=false;
            
            $('.venue').remove();
            $('.city').remove();
            $('.referee').remove();
            $('.lineupC').remove();
            $('.lineupParentHome').remove();
            $('.lineupParentAway').remove();
            $('.startEleven').remove();
            $('.fixtureInfo').remove();
            $('.statsC').remove();
            $('.homeStats').remove();
            $('.awayStats').remove();
            $('.statName').remove();
            $('.eventsC').remove();
            $('.homeEvent').remove();
            $('.awayEvent').remove();



                lineupButton.classList.add("clicked")
                infoButton.classList.remove("clicked")
                eventsButton.classList.remove("clicked")
                statsButton.classList.remove("clicked")

                

                    runLineups(fixtureId.innerHTML);
    });



            let infoButton=document.createElement('button')
            infoButton.classList='infoButton'
            infoButton.innerHTML='Info  '
            infoButton.addEventListener("click", function(){ 
                infoButton.classList.add("clicked")
                statsButton.classList.remove("clicked")
                eventsButton.classList.remove("clicked")
                lineupButton.classList.remove("clicked")

                lineupButton.disabled=false;
                statsButton.disabled=false;
                eventsButton.disabled=false;
                infoButton.disabled=true;

            $('.venue').remove();
            $('.city').remove();
            $('.referee').remove();
            $('.lineupC').remove();
            $('.lineupParentHome').remove();
            $('.lineupParentAway').remove();
            $('.startEleven').remove();
            $('.fixtureInfo').remove();
            $('.statsC').remove();
            $('.homeStats').remove();
            $('.awayStats').remove();
            $('.statName').remove();
            $('.eventsC').remove();
            $('.homeEvent').remove();
            $('.awayEvent').remove();


                let infoText = document.createElement('div')
                infoText.className = 'fixtureInfo'
                infoText.innerHTML = 'Information'
                document.querySelector('.sideScoreDiv').appendChild(infoText)
                $(infoText).hide().fadeIn(1000);

                let venueOnClick=document.createElement('Div')
                venueOnClick.classList='venue'
                venueOnClick.innerHTML=`Venue: ${venue.innerHTML}`
                document.querySelector('.sideScoreDiv').appendChild(venueOnClick)
                $(venueOnClick).hide().fadeIn(1000);

                
                let refereeOnClick=document.createElement('Div')
                refereeOnClick.classList='referee'
                refereeOnClick.innerHTML=`Referee: ${referee.innerHTML}`
                document.querySelector('.sideScoreDiv').appendChild(refereeOnClick)
                $(refereeOnClick).hide().fadeIn(1000);

                
                let cityOnClick=document.createElement('Div')
                cityOnClick.classList='city'
                cityOnClick.innerHTML=`Location: ${city.innerHTML}, ${country.innerHTML}`
                document.querySelector('.sideScoreDiv').appendChild(cityOnClick)
                $(cityOnClick).hide().fadeIn(1000);

            }) 
            
            navbarMini.appendChild(infoButton)


document.querySelector('.sideScoreDiv').appendChild(navbarMini)
});

document.querySelector('.parentContainer').appendChild(parent);}}};


//Run Page
run();
//Refresh Data
const interval = setInterval(function() {run();}, 60000);
//Page Load Delay
$( document ).ready(function() { console.log('page loaded'); setTimeout(function () { document.querySelector(".hideThis").style.visibility = "visible"; jQuery(function(){ jQuery('.parentDiv:first').click();
});}, 1000);});

