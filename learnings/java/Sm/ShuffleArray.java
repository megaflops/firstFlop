import java.util.Arrays;

class ShuffleArray {
    public static void main(String[] args) {
        int[] arr = {1,3,5,7,2,4,6,8};
       
        System.out.println("Original Array: " + Arrays.toString(arr));

        shuffle(arr,0,arr.length-1);

        System.out.println("After shuffling "+Arrays.toString(arr));
    }

    public static void shuffle(int[] arr,int start,int end) {
        if(end- start ==1) 
            return;
        int mid = (start +end ) /2;
        int s2 = mid+1;
        int s1 = (start +mid ) / 2;

        for(int i=s1+1; i<= mid;i++) {
            int temp = arr[i];
            arr[i] = arr[s2];
            arr[s2++] = temp;
        }
        shuffle(arr,start,mid);
        shuffle(arr, mid+1, end);
        
    }


}