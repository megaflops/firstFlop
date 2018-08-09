//Given two arrays of integers, find the pair of values (one from each array) with the smallest difference. (DK)
//Input = (1,3,15,11,2), (23,127,235,19,8), output: 3 with (11,8)

import java.util.*;

public class SmallDiffInArrays {
	public static void main(String[] args) {
		int[] A = {1,3,15,11,2};
		int[] B = {23,127,235,19,8};
		printArray(A, A.length);
		printArray(B, B.length);
		FindSmallDiffInArrays(A, A.length, B, B.length);
	}
	
	public static void FindSmallDiffInArrays(int[] A, int N, int[] B, int M) {
		Arrays.sort(A);
		Arrays.sort(B);		
		printArray(A, N);
		printArray(B, M);
		int iA = 0;
		int jB = 0;
		int diff = Integer.MAX_VALUE;
		int i = iA;
		int j = jB;
		while(i < N && j < M) {
			int newDiff = Math.abs(A[i] - B[j]);
			if(newDiff < diff) {
				iA = i;
				jB = j;
				diff = newDiff;
			}
			
			if(A[i] < B[j]) {
				i++;
			} else {
				j++;
			}
		}
		
		System.out.println("\nDiff=" + diff + "(" + A[iA] + "," + B[jB] + ")");
	}
	
	public static void printArray(int[] A, int N) {
		System.out.println();
		for(int i = 0; i < N; i++) {
			System.out.print(A[i] + "\t");
		}
	}
}