//declare a variable using var
var i;

//variables are things you store that have a name. Names are case sensitive!
var I = 15;

//set a variable using =
i = 10;

//you can use variables along with values you type in to do arithmetic
var j = (i * 2 + 5.1) / 7;

//write an if statement using the if keyword. Place the condition 
//inside ().
if (i == 10)
{
	
}

//if statements can have multiple things to check inside them.
//&& between checks means they both need to be true and || means
//either of them needs to be true.
if ( i > 0 && i < 20 )
{

}

//while loops are like if statements, but instead of running once if 
//the condition is true, they run over and over as long as the 
//condition is true. Make one just like an if, but use the while 
//keyword instead
while ( i > 0 )
{
	
}

//for loops loop a certain number of times. If you need to loop a 
//specific number of times, use a for loop. 
for ( i = 0 ; i < 10 ; ++i )
{
	//this for loop means "start at 0 and keep going as long as
	//you're still less than 10" so it goes from 0-9, which is 10
	//times.
}

//arrays store multiple items in a single variable. Make one using []
//we call the variables in an array elements.
var a = [1, 7, 9, "hello"];

//you access each element in the array with a number. We call this
//number an index. 0 is the first index of arrays.
var first_element = a[0];
var second_element = a[1];

//arrays have a length that tells you how many elements they have
var array_len = a.length;

//a function is a block of code we can run whenever we want to.
//this lets us save sections of code that do specific things.
function myFunction()
{
	var my_variable = 10;
}

//you make the code in a function run by typing its name with () after it.
//this is called 'calling' the function
myFunction();

//functions can take arguments. Arguments are variables that go into 
//a function so that it can calculate something about those variables
//When a function has calculated something, it can return the value.
//when you return from a function, the function ends immediately
function biggestNumber(a,b,c)
{
	if ( a > b && a > c)
	{
		return a;
	}

	if ( b > a && b > c)
	{
		return b;
	}

	if ( c > a && c > b)
	{
		return c;
	}
}

//functions also work like regular variables
var my_func = function()
{

}

//objects are like arrays. They are a way for you to store mutiple
//variables in one. Arrays use numbers refer to each element in them
//objects use names instead. You make an object using {}
var o = {};

//you can add variables to an objects using the '.'
//you give each variable a name
o.first_variable = 0;
o.second_variable = 10;

