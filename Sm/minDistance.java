
class minDistance {
    public static void main(String[] args) {
        int d = minDist("cat","cut");
        System.out.println(" Dist is "+d);

        System.out.printf(" Distance2 is %d", minDist("mango", "mangoef"));
    }
 
    public static int minDist(String a, String b) {
        int m = a.length();
        int n = b.length();

        if(m==0) return n;

        if(n==0) return m;

        int dp[][] = new int [m+1][n+1];

        for(int i=0;i<=m;i++) {
            dp[i][0] = i;
        }
        for(int i=0;i<=n;i++) {
            dp[0][i] = i;
        }

        for(int i=1;i<=m;i++) {
            for(int j=1;j<=n;j++) {
                if((i-1 <= m ) && ( j-1 <= n ) && (a.charAt(i-1) == b.charAt(j-1))) {
                    dp[i][j] = dp[i-1][j-1];
                }
                else {
                    dp[i][j] = 1+ Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
                }
            }
        }        
        return dp[m][n];     
    }
}