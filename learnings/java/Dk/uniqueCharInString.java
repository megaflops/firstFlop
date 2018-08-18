//**Implement an algorithm to determine if a string has all unique characters. (DK)

public class uniqueCharInString{
	public static void main(String[] args) {
		System.out.println(IsUniqueCharacters("ABCD".toUpperCase()));
		System.out.println(IsUniqueCharacters("ABCDXYAZ".toUpperCase()));
	}
	
	public static boolean IsUniqueCharacters(String input) {
		boolean[] map = new boolean[26];
		for(int i = 0; i < input.length(); i++) {
			int index = (int)input.charAt(i) - (int)'A';
			if(map[index]) return true;
			map[index] = true;
		}
		
		return false;
	}
	
}