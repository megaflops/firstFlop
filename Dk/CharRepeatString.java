//Find first repeated and first non-repeated character in a string. (DK)
public class CharRepeatString {
	public static void main(String[] args) {
		FindFirstInString("ABCDABD");
	}
	
	public static void FindFirstInString(String input){
		int[] map = new int[26];
		
		char firstRepeat = '$';
		for(int i = 0; i < input.length(); i++) {
			int index = (int)input.charAt(i) - (int)'A';
			if(firstRepeat == '$' && map[index] != 0) firstRepeat = input.charAt(i);
			map[index]++;
		}
		
		char firstNonRepeat = '$';
		for(int i = 0; i < input.length(); i++) {
			int index = (int)input.charAt(i) - (int)'A';
			if(map[index] == 1) {
				firstNonRepeat = input.charAt(i);
				break;
			}
		}
		
		System.out.println("First Repeat:" + firstRepeat );
		System.out.println("First NonRepeat:" + firstNonRepeat );
	}
}