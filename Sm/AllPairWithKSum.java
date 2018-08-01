// template for useful java syntax
import java.util.*;
import java.io.*;


class AllPairWithKSum {

	public static void main(String[] args){
		
		int[] aInt = {-2,14,-1,0,9,13,6,5,3,7};
		for(int i = 0; i < aInt.length; i++) {
			System.out.println(aInt[i]);
		}
    
    ArrayList<List<Integer>> retList = findPairWithKSum(aInt, aInt.length, 11);

    for (List a : retList) {
        System.out.println(a.get(0) + " " + a.get(1));
    }
    
    }

    public static ArrayList<List<Integer>> findPairWithKSum(int[] arr,int len,int k) {
        ArrayList<List<Integer>> retList = new ArrayList<List<Integer>>(); 
        List<Integer> lst = new ArrayList<Integer>() ;
        
        for(int i=0;i<len;i++) {
            if(lst.contains( k - arr[i]) ) {
                List<Integer> tmp = new ArrayList<Integer>();
                tmp.add(arr[i]);
                tmp.add(k - arr[i]);
                retList.add(tmp);                                        
            }

            lst.add(arr[i]);
            }
        
        return retList;
    }

}