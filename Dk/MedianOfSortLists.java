//*Find median from the given two sorted list. (DK)
public class MedianOfSortLists {
	public static void main(String[] args) {
		System.out.println("Hello World\n");
		int[] A = {1,3,5,7,9,11};
		int[] B = {2,4,6,8,10};
		System.out.println(FindMedian(A, A.length, B, B.length));
	}
	
	public static double FindMedian(int[] A, int N, int[] B, int M) {
		int element = A[0];
		
		int i = 0;
		int j = 0;
		int c = 0;
		int pElement = 0;
		while(c < (N+M)/2 + 1 && i < N && j < M){
			if(A[i] < B[j]) {
				pElement = element;
				element = A[i];
				i++; 
			}else {
				pElement = element;
				element = B[j];
				j++;
			}
			c++;
		}
		
		if(c < (N+M)/2 + 1) {
			int diff = (N+M)/2 -c;
			if(i >= N) {
				pElement = element;
				element = B[j + diff];
			} else {
				pElement = element;
				element = A[i + diff];
			}
		}
		
		if((N+M)% 2 == 0) {
			return (double)(pElement + element)/2;
		} else {
			return element;
		}
	}
}