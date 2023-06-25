#ifndef HASHTABLE_HPP
#define HASHTABLE_HPP
#include <iostream>
#include <vector>

class HashTable {

    public:
        long a;
        long c;
        long m;
        std::vector<int> buckets;
        HashTable(long, long, long);
        ~HashTable();
        void insert(int);
        void extend();
        bool find(int);
        void remove(int);
        double loadFactor();
        int hashFunction(int k);
};

#endif
