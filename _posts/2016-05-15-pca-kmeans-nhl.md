---
layout: post
title:  'PCA and K-Means on NHL Stats'
date:   2016-05-15 15:05:41
categories: project data matlab nhl hockey nhl-projections
thumbnail: /assets/img/post-thumbnails/stanley-cup-2016.png
---

After all this learning of PCA and [k-means clustering]({% post_url 2016-03-09-clustering-with-kmeans %}), I wanted to try a small test to see how they would work on some real data. I pulled a bunch of stats for the 30 NHL teams and wanted to see how those could be used to categorize each team making (or not making) the Stanley Cup Playoffs. First I reduced the data to just the key features (using PCA) and then tried clustering from that. And what do you know, it worked!

It only messed up on Boston and Detroit but they were in a tight race to make the playoffs up until the very end, so that makes sense, given the context. Math continues to prevail!

For anyone interested, you can find the MATLAB code for this example [here](https://github.com/ben-tanen/DataMining/tree/master/nhl-clustering).


| Team | In Playoffs   | K-means Cluster |
|------|---------------|-----------------|
| ANA  | YES           | 1               |
| ARI  | NO            | 2               |
| BOS  | NO            | 1               |
| BUF  | NO            | 2               |
| CAR  | NO            | 2               |
| CBJ  | NO            | 2               |
| CGY  | NO            | 2               |
| CHI  | YES           | 1               |
| COL  | NO            | 2               |
| DAL  | YES           | 1               |
| DET  | YES           | 2               |
| EDM  | NO            | 2               |
| FLA  | YES           | 1               |
| LAK  | YES           | 1               |
| MIN  | YES           | 1               |
| MTL  | NO            | 2               |
| NJD  | NO            | 2               |
| NSH  | YES           | 1               |
| NYI  | YES           | 1               |
| NYR  | YES           | 1               |
| OTT  | NO            | 2               |
| PHI  | YES           | 1               |
| PIT  | YES           | 1               |
| SJS  | YES           | 1               |
| STL  | YES           | 1               |
| TBL  | YES           | 1               |
| TOR  | NO            | 2               |
| VAN  | NO            | 2               |
| WSH  | YES           | 1               |
| WPG  | NO            | 2               |

