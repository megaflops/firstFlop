// template for useful java syntax
import java.util.*;
import java.io.*;

public class nthFibo {
	public static void main(String[] args) {
		String testString = "this ia a test string only";
		int len = testString.length();
		int spaceCount=1,i=0;
		char[] myArrays = new char[len + 50];
		myArrays = testString.toCharArray();
		while(i < len){
			if(myArrays[i] == " " ){
			 System.out.println("got space");
			  spaceCount++;
			}
			else{
			 System.out.println("Char is " +myArrays[i]);

			}
		}
		
		newLenght = len + (spaceCount*2);
		for(i=newLenght ; i<0 ; i--) {
		if(myArrays[i] == ' '){
			
		}
		else{

		}

	}
}


