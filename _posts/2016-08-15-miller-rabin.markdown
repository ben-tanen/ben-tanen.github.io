---
layout: post
title:  'Miller-Rabin Primality Test'
date:   2016-08-15 15:05:41
categories: algorithm probability
---

Back when I started messing around with code, I was told to try out [Project Euler](https://projecteuler.net/) to improve my coding skills (something I suggest everyone do). I was able to progress fairly well along but I always struggled and skipped the questions involving prime numbers because I could never get my code to run efficiently on it.

I looked for a solution and repeatedly only found mention to the [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes), which is fairly intuitive and appeared to be the go-to primality test. However, in my early days of programming, I still struggled to implement the algorithm so I ultimately pushed those prime-based questions off to the side.

Years later, while reading Brian Christian's and Tom Griffiths' [Algorithms to Live By](https://www.amazon.com/Algorithms-Live-Computer-Science-Decisions/dp/1627790365), I happened across the **Miller-Rabin Primality Test**. This algorithm works as follows: say you wanted to test if $$n$$ (an odd integer) is a prime-number. To do so, we can first find $$r$$ and $$s$$ such that $$n = 2^r s + 1$$. Next, we can pick a random $$a$$ such that $$1 \leq a \leq n - 1$$. With $$a, r, s$$ all defined, we next test if $$a^s = 1 \textrm{  mod  } n$$ or $$a^{2js} = -1 \textrm{  mod  } n$$ for some $$0 \leq j \leq r - 1$$. If either of these equalities are true, then we can say that $$n$$ passes the test and any prime number will pass the test. However, the trick with this algorithm is that non-prime numbers will also pass this test (return a false-positive) $$\frac{1}{4}$$ of the time.

To correct for this, we can try the test again with a new randomly-selected $$a$$. If $$n$$ again passes the test, we know that there is a $$\frac{1}{4} \cdot \frac{1}{4} = \frac{1}{16}$$ chance that $$n$$ is not actually a prime. Therefore, if we repeated the test $$N$$ times successfully, we can say that there is a $$\frac{1}{4^N}$$ chance that $$n$$ is not actually a prime number. Using this method, we can determine if a particular number is prime with fairly high certainty after only a few iterations. For example, if we repeat the test $$N = 5$$ times, we can declare $$n$$ to be prime with 99.9% certainty. If $$n$$ passes after $$N = 10$$ iterations, we know with 99.9999%.

Using this, I took another crack at those pesky prime-based Project Euler problems and what do you know, it worked like a charm! While there is a very, very, very slim chance that this still returns a false-positive (I'm using $$N = 8$$ so a 0.00153% chance), given the non-critical context of the application, I'll definitely take the speed increase over the non-100% certainty.

For anyone interested, I've included a sample implementation of the algorithm below.

{% highlight python %}
# takes in a number n and a number of iterations iters
# to test if n is prime with (1 - (1 / 4^iters)) certainty
def miller_rabin(n, iters):
    # find s and d
    # such that: n = (2^s)d + 1
    d = n - 1
    s = 0
    while d % 2 == 0:
        d = d / 2
        s += 1

    # test n multiple times
    for i in range(iters):
        r = random.randint(1, n - 1)
        for j in range(s):
            x = r**(d * 2**j) % n
            if ((j == 0 and x == 1) or (x == n - 1)):
                break
            elif (j == s - 1):
                return False
    return True
{% endhighlight %}







