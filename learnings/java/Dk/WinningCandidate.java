//**Find the winning candidate from an election voting Array. (DK)
import java.util.*;

public class WinningCandidate{
	public static void main(String[] args) {
		int[] A = {4,3,2,1,1,3,2,4,5,2,2,3,3,2,3,4,3,3,4,5};
		System.out.println("Winning candidate:" + WinningVote(A, A.length));
		System.out.println("Winning candidate:" + WinningVote(A, A.length, 5));
	}
	
	public static int WinningVote(int[] A, int N) {
		Arrays.sort(A);
		int candidate = A[0];
		int count = 1;
		int countMax = 0;
		for(int i =  1; i < N; i++) {
			if(A[i] == A[i-1]) {
				count++;
			} else {
				if(count > countMax) {
					candidate = A[i-1];
					countMax = count;
				}
				count = 0;
			}
		}
		
		return candidate;
	}
	
	public static int WinningVote(int[] A, int N, int k) {
		int[] V = new int[k];
		for(int i = 0; i < N; i++) {
			V[A[i]-1]++;
		}
		
		int candidate = 0;
		for(int i = 1; i < k; i++) {
			if(V[i] > V[candidate]) candidate = i;
		}
		
		return candidate+1;
	}
}