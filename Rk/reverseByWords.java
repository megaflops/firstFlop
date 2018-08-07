import java.util.*;
import java.io.*;

class reverseByWords {
	  
 		void reverseString(String src) {
		String split =" "; 
		String temp = src;
		int index =0,i=0,j=0,k=0;
		System.out.println( "mystring " +src);
	
		for(i=0; i < src.length(); i++){
		 if( temp.charAt(i) == ' '){
		     System.out.println( "got space" +index  +" " +k);
		     for(j=i ; j >= k ; j--) {
		     split = split + src.charAt(j);
		     System.out.println( "char is " +src.charAt(j));
		     }
		     k = i+1;
		     //src = src +  src.charAt(index + 1);
		 }
		 else{
		    index++;
		 }
		}
		System.out.println( "mystring " +split);
		}
		public static void main(String[] args) 
  		 {
			reverseByWords obj = new reverseByWords();
			obj.reverseString("this is flop string ");
		}
  }

		     
			


