//**Separate even and odd numbers in an array. (DK)
public class EvenOdd {
	public static void main(String[] args) {
		System.out.println("Hello world");
		int[] A = {0,1,2,3,4,5,6,7,8,9};
		printArray(A, A.length);
		A = SeparateEvenOdd(A, A.length);
		printArray(A, A.length);
	}
	
	public static int[] SeparateEvenOdd(int[] A, int N) {
		int i = 0;
		int j = N -1;
		while( i < j) {
			while( i < N-1) if( i % 2 == 0) i++; else break;
			while( j > 0) if( j % 2 == 1) j--; else break;
			if(i < j) swap(A, i, j);
			i++; j--;
		}
		return A;		
	}
	
	public static void printArray(int[] A, int N) {
		for(int i = 0; i < N; i++) {
			System.out.print(A[i] + "\t");
		}
	}
	
	public static void swap(int[] A, int i , int j) {
		int t = A[i];
		A[i] = A[j];
		A[j] = t;
	}
}
