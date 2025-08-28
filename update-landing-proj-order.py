# -*- coding: utf-8 -*-

import csv, re

with open("assets/data/landing-proj-order.csv") as f_csv:
    csv_reader = csv.reader(f_csv, delimiter = ",")
    for row in csv_reader:
        if row[1] == "post":
            continue
        p_proj = "%s/%s" % ("_posts" if int(row[1]) == 1 else "_landing-projects", row[0])
        try:
            with open(p_proj, mode = "r") as f_proj:
                txt_old = f_proj.read()
            txt_new = re.sub("landing-order: (\")?([0-9]|\|)+(\")?", "landing-order: %s" % (row[4]), txt_old)
            with open(p_proj, mode = "w") as f_proj:
                f_proj.write(txt_new)
            print("UPDATED: %s" % p_proj)
        except:
            print("FILE NOT FOUND: %s" % p_proj)
        
                
                
        
    

