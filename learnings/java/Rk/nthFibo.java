// template for useful java syntax
import java.util.*;
import java.io.*;

public class nthFibo {
	public static void main(String[] args) {
        long  prev=1,next=1,temp,counter=1;
	Scanner sc=new Scanner(System.in);
	System.out.println("enter first number \n");
	int n =sc.nextInt();
	for(;;){
	    //System.out.println("num" +next);
 	    if(++counter >= n) {	
		System.out.println(":: " +n +" Fibinaci is " +next);
		break;
	     }
            temp = next;
	    next = prev + next;
	    prev = temp; 
       }
	
}	
}

