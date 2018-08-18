// template for useful java syntax
import java.util.*;
import java.io.*;
import java.lang.Math;
import java.util.Arrays;

public class kThSmallDistanceInArray {

	public static void main(String[] args) {
	kThSmallDistanceInArray obj;
	int  [] myArray = {2,34,56,63};//,23,89,67,23,45,12};
	int smallDistance;
	Arrays.sort(myArray);
	obj = new kThSmallDistanceInArray();

	System.out.println("Sorted Array " +Arrays.toString(myArray) +"::" +myArray.length);
	//smallDistance = obj.divideAndConquer(0,myArray.length-1,myArray);
	obj.bruteForce(myArray,myArray.length);
	}

	static int divideAndConquer(int start, int end , int [] array){
		int mid = (start + end)/2;
		int dis1,dis2;
		if( (end-start) <= 1){
		   System.out.println("return ,, " +array[start] +"::" +array[end]);
		   return Math.abs( (array[start]-array[end]));
		}
		
		System.out.println("Calling 1 " +start +" " +mid);
     		dis1 = divideAndConquer(start,mid,array);
		System.out.println("Calling 2 " +start +" " +end);
		dis2 = divideAndConquer(mid,end,array);
		System.out.println("return " +start +" " +end);
		return Math.abs( (dis1-dis2));
	}

	static int bruteForce(int [] array, int len){
	 int i,j;
	 int kArrayNumElementArray [] = {0,0,0,0,0};
 	 int kArayNumElementArrayLength =5;
	 for(i=0; i< len ; i++){
	    for(j=i ; j<len ; j++){
		insertSortedTillK( (Maths.abs(array[i] - array[j])) , kArayNumElementArrayLength , kArrayNumElementArray );
	    }
	  }
	}

	static void insertSortedTillK(int value, int k , int [] kArayNumElementArray ){
	     int i, temp;
	     for(i=0 ; i < k ; i++){
		 if(kArayNumElementArray[i] > value){
			temp = i;
			while(i < k-1){
			 kArayNumElementArray[i+1] = kArayNumElementArray[i];
			}
			kArayNumElementArray[temp] = value;
			return;
		 }
	     }
	}

}

	
		

