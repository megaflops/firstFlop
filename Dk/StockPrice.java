//***Consider an array of stock price of n consecutive days. Find the day on which we can buy the stock and the day on which we can sell the stock so that we can make maximum profit. (DK)

public class StockPrice {
	
	public static void main(String[] args) {
		int[] A = {100, 180, 260, 310, 40, 535, 695};
		System.out.println(BestProfitBuySell(A, A.length));
	}
	
	public static int BestProfitBuySell(int[] A, int N) {
		int min = 0;
		int maxProfit = -1;
		int buy = 0;
		int sell = 0;
		
		for(int i = 0; i < N; i++) {
			if(A[i] < A[min]) min = i;
			if(maxProfit < (A[i] - A[min])){
				buy = min;
				sell = i;
				maxProfit = A[i] - A[min];
			}
		}
		System.out.println("Buy At:(" + buy + ")" + A[buy] +  " |  Sell at:(" + sell + ")" + A[sell]);
		return maxProfit;
	}

}