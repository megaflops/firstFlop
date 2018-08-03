// template for useful java syntax
import java.util.*;
import java.io.*;

public class findRotation {
	public static void main(String[] args) {
	// need to find the smallest element in array	
	char array[] = {32,35,50,60,100,1,5,7,10,12};
	System.out.println("base string " +array);
	int index = -1,i;
	int num = array[0];

	for(i=1; i< array.length ; i++) {
	   if(array[i] < num ){
	      num = array[i];
	      index = i;
	 }
	}
	System.out.println("rotation index  " +index +" "  +array[index]);
 }
}

