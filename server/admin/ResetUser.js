var filename = 'server/admin/ResetUser.js';

/** Database insert method for qolls  **/
Meteor.methods({
        adminResetOnSvr: function(userNm){
            qlog.info("reset USER SERVER call: *" + userNm+"*", filename);

            var foundO=Meteor.users.find({ "emails.address" : userNm }).fetch();

       
            
            var newpass ="Error User not found";
            if (foundO.length >0){
                /*var output = '';
                for (property in foundO[0]) {
                    if(typeof(property) != "function"){
                        output += property + ': ' + foundO[0][property]+'; ';
                    }
                }
                qlog.info(" Found USER Object " +  output);*/
                var foundUId = foundO[0]._id;
                qlog.info("reset USER SERVER found : " + foundUId, filename);
                newpass = 'qusr'+Math.floor((Math.random()*10000)+373);            
                Accounts.setPassword(foundUId, newpass);
                //qlog.info("reset USER SERVER new pass: " + newpass, filename);
            }else{
                qlog.info("reset FIND failed : " + userNm, filename);
            }
            return newpass;
        },
});