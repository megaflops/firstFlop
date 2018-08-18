// template for useful java syntax
import java.util.*;
import java.io.*;

public class replaceString {
	public static void main(String[] args) {
		String testString = "this is a test only string";
		int len = testString.length();
		int spaceCount=0,i=0,j=0,newLength;
		char[] myArrays = new char[len + 50];
		//myArrays = testString.toCharArray();
		//myArrays[len] = '';
		testString.getChars(0, len, myArrays, 0);
                //myArrays[len] = '\0';
		for(i=0; i < len ; i++)
	    		System.out.println("base string " +myArrays[i]);
		i=0;
		while(i < len){
			if(myArrays[i] == ' ' ){
			 System.out.println("got space");
			  spaceCount++;
			}
			else{
			 System.out.println("Char is " +myArrays[i]);
			}
			i++;
		}
		
		newLength = len + (spaceCount*2);
		j=newLength;
		for(i=len ; i>0 ; i--) {
		if(myArrays[i] == ' ') {
		   myArrays[j] = '%';
		   myArrays[j-1] = '2';
     	           myArrays[j-2] = '0';
		   j -=3;	
		   System.out.println("got space relpacing " +j  +" " +newLength +" " +len);   
		}
		else{
		  myArrays[j] = myArrays[i];
		  j--;
		  System.out.println("got space  " +j  +" " +newLength +" " +len +"##" +myArrays[j+1]);
		}
	
	     }
	     for(i=0; i < newLength ; i++)
	    	System.out.println("Final string " +myArrays[i]);
}
}

