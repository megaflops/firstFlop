//**Reverse a singly linked list pairwise
public class ReverseLinkListInPair {
	public static class Node {
		int data;
		Node next;
	}
	public static void main(String[] args){
		int[] A = {1,2,3,4,5,6};
		Node linkedList = createLinkedList(A, A.length);
		displayLinkedList(linkedList);
        //linkedList = reverseInPairItr(linkedList);
        linkedList = reverseInPairRecursive(linkedList);
		displayLinkedList(linkedList);
	}
	
	public static Node reverseInPairItr(Node head) {
        Node current=head;
        Node temp=null;
        Node newHead =null;
        while (current != null && current.next != null) {
     
            if (temp != null) {
                // increement temp 2 step   
                temp.next.next = current.next;
            }
            temp=current.next; 
            current.next=temp.next;
            temp.next=current;
     
            if (newHead == null)
                newHead = temp;
            current=current.next;
     
        } 
        return newHead;
    }
    
    public static Node reverseInPairRecursive(Node head) {
        if (head == null || head.next == null) {
            return head;
        }
    
       Node temp=head.next;
    
       head.next=temp.next;
    
       temp.next=head;
       head.next=reverseInPairRecursive(head.next);    
       return temp;
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
            System.out.print(list.data );
            if(list.next!=null) System.out.print("->");
			list = list.next;
		}
	}
}