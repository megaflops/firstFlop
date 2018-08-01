// template for useful java syntax
import java.util.*;
import java.io.*;


class AllPairWithKSum {

	public static void main(String[] args){
		
		int[] aInt = {-2,14,-1,0,9,13,6,5,3,7};
		for(int i = 0; i < aInt.length; i++) {
			System.out.println(aInt[i]);
		}
    
    ArrayList<List<Integer>> retList = paisWithKSum(aInt, aInt.length, 11);

    for (List a : retList) {
        System.out.println(a.get(0) + " " + a.get(1));
    }
    
    }

    public static ArrayList<List<Integer>> paisWithKSum(int[] arr,int len,int k) {
        ArrayList<List<Integer>> retList = new ArrayList<List<Integer>>(); 
        for(int i=0;i<len;i++) {
            for(int j=0;j<len;j++) {
                if((arr[i]+ arr[j]) ==k ) {
                    List<Integer> tmp = new ArrayList<Integer>();
                    tmp.add(arr[i]);
                    tmp.add(arr[j]);
                    retList.add(tmp);
                                    }
            }
        }
        return retList;
    }
}