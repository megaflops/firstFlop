// template for useful java syntax
import java.util.*;
import java.io.*;


class largestElementInArray {

	public static void main(String[] args){		
		
		int[] aInt = {1,2,3,10,5,6,7,8,9,4};

        System.out.println("Largest 2nd Number is :"+  secondLargestNumber(aInt,aInt.length));

	}

	public static int secondLargestNumber(int[] arr,int arrLen) {
	int[] arrInt = arr;
	int large,large2;
	large= large2 = Integer.MIN_VALUE;
	for(int i = 1; i < arrInt.length; i++) {
	 if( arrInt[i] > large) { 	  
	  large2 = large;
	  large = arrInt[i];
	  }	 
	  else if(arrInt[i] > large2 && (arrInt[i]!= large) ) {
		  large2 = arrInt[i];
	  }

	}
	return large2;
	}


}

