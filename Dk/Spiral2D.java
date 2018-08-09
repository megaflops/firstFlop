//** Spiral 2d array printing 
public class Spiral2D {
	public static void main(String[] args) {
		System.out.println("Hello World\n");
		
		/*
		int N = 4;
		int [][] A = {
				{1,2,3,4},
				{5,6,7,8},
				{9,10,11,12},
				{13,14,15,16}
			};
		*/
		int N = 5;
		int [][] A = {
				{1,2,3,4,5},
				{6,7,8,9,10},
				{11,12,13,14,15},
				{16,17,18,19,20},
				{21,22,23,24,25},
			};		
		for(int i = 0; i < N; i++) {
			System.out.println();
			for(int j = 0; j < N; j++) {
				System.out.print(A[i][j] + "\t");
			}
		}
		System.out.println();
		System.out.println();
		printSpiral(A,N);
		
	}
	
	public static void printSpiral (int[][] A, int N) {
		int c1 = 0;
		int c2 = N;
		int r1 = 0;
		int r2 = N;
		
		while (c1 < c2 && r1 < r2)
		{
			//L->R
			for(int i = c1; i < c2; i++) System.out.print(A[r1][i] + "\t");
			r1++;
			//R->B
			for(int i = r1; i < r2; i++) System.out.print(A[i][c2-1] + "\t");
			c2--;
			//B->L
			for(int i = c2-1; i > c1; i--) System.out.print(A[r2-1][i] + "\t");
			r2--;
			//L->U
			for(int i = r2; i >= r1; i--) System.out.print(A[i][c1] + "\t");
			c1++;
		}
		
	}
}