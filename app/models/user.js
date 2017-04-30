

 var request=require('request');
 var Q=require('q');
  
exports.localAuth = function (email, password) {
  var deferred = Q.defer();
      var user = {
        "email": email,
        "password": password
       
      }

     var options = {
            url: 'http://ceceia.com.ar/db/checklogin.php',
           
            method: 'POST',
            json: {
              "usser":email,
              "pass":password
            }
            
        }
        request(options, function(error, response, body){
            if(error) console.log(error);
            else{
                
               
                if(body.toString()==email){

                    deferred.resolve(user);
                    
                } else {
                  
                  deferred.resolve(false);
                }
            } 
        });      
     
  
   return deferred.promise;
  };


