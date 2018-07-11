---
layout: single
title:  "Using heap is C++"
date:   2018-07-11 16:12:06 +0900
categories: [C++]
tags: [C++, heap]
---

Heap is a very important and widely used in any programing language. Unlike queue and stack, there are no dedicated class for heap in C++. However, there are some functions that let you work with heap in C++. This post will discuss about these functions and how should we use them.

##### 1. make_heap()
```cpp
template <class RandomAccessIterator, class Compare>
  void make_heap (RandomAccessIterator first, RandomAccessIterator last,
                  Compare comp );
```
A heap in C++ is a max-heap by default, the default comparator is `operator<`, if you want a min_heap change the comp arguments to something like `std::greater<int>()`.the element with the highest order is always pointed by first. It can be retrieved by the function `front()`. the range is [first,last), first and last in must be random access iterators so vector is the best bet. The value type should be valid to the swap function, means it should be move-constructible and move-assignable.
This function will take O(N) where N is the number of elements.

##### 2. push_heap()
```cpp
template <class RandomAccessIterator, class Compare>
  void push_heap (RandomAccessIterator first, RandomAccessIterator last,
                   Compare comp);
```
Given a heap in the range [first,last-1), this function extends the range considered a heap to [first,last) by placing the value in (last-1) into its corresponding location within it. This function will take O(log(N)).

##### 3. pop_heap()
```cpp
template <class RandomAccessIterator, class Compare>
  void pop_heap (RandomAccessIterator first, RandomAccessIterator last,
                 Compare comp);
```
The element with the highest value is moved from first to (last-1) (which now is out of the heap), the other elements are reorganized in such a way that the range [first,last-1) preserves the properties of a heap. If the previous heap is [begin(), end()), after this function its not true any more. So we need a variable to keep track of the end of the heap. The complexity of this function is O(log(N)).

##### 4. sort_heap()
```cpp
template <class RandomAccessIterator, class Compare>
  void sort_heap (RandomAccessIterator first, RandomAccessIterator last,
                  Compare comp);
```
Sorts the elements in the heap range [first,last) into ascending order. The range loses its properties as a heap. This is sort heap, and it take  N*log(N).
##### 5. is_heap() and is_heap_until()
```cpp
template< class RandomIt, class Compare >
constexpr bool is_heap( RandomIt first, RandomIt last, Compare comp );

template< class RandomIt, class Compare >
constexpr RandomIt is_heap_until( RandomIt first, RandomIt last, Compare comp );
```
`is_heap` check if the range is a heap or not and return a bool value. While `is_heap_until` return finds the largest range [first, last) beginning at first which is a heap. These to function took O(N).

##### Discussion
As we can see, techniques to manage a heap are complex and prone to errors since we have to keep track of the heap's base representation and variables. May be this is because it is inherited from older version of C++. Vector should be used as the base representation and a variable should be define to keep track of the ending of the heap.
