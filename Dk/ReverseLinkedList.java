//**Reverse a singly linked list (DK)
public class ReverseLinkedList {
	public static class Node {
		int data;
		Node next;
	}
	public static void main(String[] args){
		int[] A = {1,2,3,4,5,6};
		Node linkedList = createLinkedList(A, A.length);
		displayLinkedList(linkedList);
		linkedList = reverse(linkedList);
		displayLinkedList(linkedList);
	}
	
	public static Node reverse(Node list) {
		Node prev = null;
		if(list == null) return prev;
		else if(list.next == null) return list;
		Node curr = list;
		while(curr != null) {
			Node temp = curr.next;
			curr.next = prev;
			prev = curr;
			curr = temp;
		}
		
		return prev;
	}
	
	public static Node createLinkedList(int[] A, int N) {
		Node current = new Node();
		Node list = current;
		current.data = A[0];
		current.next = null;
		for(int i = 1; i < N; i++) {
			Node t = new Node();
			t.data = A[i];
			t.next = null;
			current.next = t;
			current = t;
		}
		
		return list;
	}
	
	public static void displayLinkedList(Node list) {
		if(list == null) return;
		System.out.println();
		while(list != null) {
			System.out.print(list.data + "->");
			list = list.next;
		}
	}
}