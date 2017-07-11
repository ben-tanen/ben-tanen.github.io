---
layout: post
title:  'Support Vector Machines and Poetry'
date:   2016-05-3 15:05:41
categories: project data matlab classification
---

My tales of data mining continue and this time, they're about [support vector machines](http://docs.opencv.org/2.4/doc/tutorials/ml/introduction_to_svm/introduction_to_svm.html). These fancy little classifiers are particularly awesome when it comes to aiding a computer in distinguishing between two (or more) groups of data. I previously wrote about [k-means clustering](/blog/2016/03/09/clustering-with-kmeans.html) which is a great way to quickly cluster some existing data. However, when it comes to classifying new data points, clustering isn't a fantastic method.

As an alternative, SVMs are pretty great at providing classifications that work for existing data *and* future data. An example that I found particular interesting was used to distinguish between poems written in English and poems written in German. For example, take the following two excerpts:

> *What happens to a dream deferred? Does it dry up*

> *Aktenstose nachts verschlingen, Schwatzen nach der Welt*

It's pretty obvious to anyone who speaks English or German which language these poems are written in. But to a naive computer, these are just strings of characters. To aid in distinguishing, let's consider two features of these 50-character excerpts: the number of complete words and the number of times the letter "i" occurs.

Using this information as the main "features" of our data, we can compute and define a hyperplane (or in this case, a line) to find if there is a meaningful division between English and German given the "features" we are analyzing (for more on the math behind this, see [here](http://docs.opencv.org/2.4/doc/tutorials/ml/introduction_to_svm/introduction_to_svm.html)). If we compute and plot this for ten different excerpts, we get the following:

{% include figure.html src="/assets/img/posts/svm_poems.png" alt="A graph showing our poems and our SVM" width="450px" %}

We can see that, for the most part, German poems end up on the left side of the line and English poems end up on the right, indicating at least a mildly significant relationship in our features. To further test it, we can try another *new* excerpt: 

> *Hat der alte Hexenmeister sich doch einmal wegbege*

If we go ahead and plot this (seen above in magenta), we can see that this obviously German poem is again partitioned as expected without needing to update our hyperplane. Hurray, math works!

For anyone interested, you can find the MATLAB code for this example [here](https://github.com/ben-tanen/DataMining/tree/master/svm-poems) and other data mining projects [here](https://github.com/ben-tanen/data-mining).


