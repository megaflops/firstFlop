// template for useful java syntax
import java.util.*;
import java.io.*;
import java.lang.Math;

public class pairOfPoint {
	
	static public class point {
	int x;
	int y;
	private point(int a, int b) {
		x =a;
		y=b;
	}
	};
	//double bruteForce1(point [] p, int len);
	static int minD=0xFFFFFF;
	static double d;
	public static void main(String[] args) {
	point [] mypoint = {
			new point(3,4),
			new point(8,9),
			new point(4,6)
	};
	//, {8.0,9.0} , {4.0,6.0} };
	//System.out.println("point Array " +mypoint);
	minD = (int)bruteForce(mypoint,3);
	System.out.println("min distance" +minD);
	}

	static double bruteForce(point [] p, int len){
	int i,j;
	for(i=0 ; i<len; i++){
	    for(j=1; j<len ; j++) {
		   d = findSqrt(p[i],p[j]);
		   if((int)d < minD)
		       minD=(int)d;
	   }
          }
	return minD;
	 } /*bruteForce*/
	static double findSqrt(point px, point py){
		return Math.hypot(px.x, py.y);
	}
}

	
		

