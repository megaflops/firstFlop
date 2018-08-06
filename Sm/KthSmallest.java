import java.util.*;

class KthSmallest {
public static void main(String[] args) {
    int[] Arr = {2,5,6,8,7,9,1,3,10,19};
    int k=6;

    int x= findKthSmallest(Arr,Arr.length,k);

    System.out.println("4th Smallest Number is :" +x);
}

public static int findKthSmallest(int[] A,int len,int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
    
    for(int i=0;i<len;i++) {
        pq.offer(A[i]);
    }

    int n= -1;
    while(k>0) {
        n= pq.poll();
        k--;
    }
    return n;
 }
}