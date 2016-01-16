var num = 0;

module.exports = function() {
	
	//console.log(num);
	num ++;
	
	var account = {
		"username": "testUser" + num,
		"password": "pass1111",
		"confirmPassword": "pass1111"
		
	}
	
	//console.log(account);
	
	return account;
}