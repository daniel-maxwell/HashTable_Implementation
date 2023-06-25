#include "HashTable.hpp"

HashTable::HashTable(long _a, long _c, long _m) {
    a = _a;
    c = _c;
    m = _m;
    std::vector<int>tempBuckets(m, -1);
    buckets = tempBuckets;
}

HashTable::~HashTable() {
}

/* Inserts (strictly positive) numbers into the hash
table, using linear probing for collision resolution. The number to insert is stored
in the variable key. If the load factor of the hash table  is  already  1, applies extend and rehash. */
void HashTable::insert(int key) {
    if (loadFactor() == 1) extend();

    int bucket = hashFunction(m);

    while (buckets[bucket] != -1) {
        ++bucket;
        if (bucket == buckets.size()) bucket = 0;
    }

    buckets[bucket] = key;
}

/*
Increases the size of the hash table by creating an array  temporarily  storing  the  content  of  the  hash  table.
Once a new (large) vector has been created, elements previously stored are  rehashed into their correct buckets.
*/
void HashTable::extend() {

    std::vector<int>tempBuckets {};
    for (int el : buckets) {
        if (el != -1) tempBuckets.push_back(el);
    }
    m = m * 1.5;
    new HashTable(a, c, m);

    for (int el : tempBuckets) {
        HashTable::insert(el);
    }
}

// Initially uses the hash function to search for key, then checks successive buckets (linear probing).
// Wraps around the vector if it reaches the end and terminates once all buckets have been checked.
bool HashTable::find(int key) {
    int hashVal = hashFunction(key);
    for (int i = 0; i < buckets.size(); ++i) {
        if (hashVal + i == buckets.size()) hashVal = -i;
        if (buckets[hashVal + i] == key) return true;
    }
    return false;
}

// Initially uses the hash function to search for key, then checks successive buckets (linear probing).
// When the key is found, it is deleted from buckets (set to -1) and iteration halts.
// Otherwise iteration terminates once all buckets have been checked and the key is not found.
void HashTable::remove(int key) {
    int hashVal = hashFunction(key);
    for (int i = 0; i < buckets.size(); ++i) {
        if (hashVal + i == buckets.size()) hashVal = -i;
        if (buckets[hashVal + i] == key) {
            buckets[hashVal + i] = -1;
            break;
        };
    };
};

/*Returns as a double, the fraction of total hash buckets that are occupied.*/
double HashTable::loadFactor() {
    int empties = 0;
    for (int i = 0; i < m; ++i) {
        if (buckets[i] == -1) ++empties;
    }
    return m / empties;
}

/* Simple hash function using a mod */
int HashTable::hashFunction(int k) {
    return (a*k+c) % m;
}

int main() {
    return 0;
}