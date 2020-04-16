import os
import json
# import numpy as np
import csv
from pdb import set_trace as bp

data_path = 'data/20200416'
list_of_ids = os.listdir(data_path)
data_info = open('data/20200416/20200416.csv','w')
csvwriter = csv.writer(data_info)
c = 0
for x in list_of_ids:
    with open(os.path.join(data_path,x,"metadata.json")) as f:
        metadata = json.load(f)
        if not c:
            header = list(metadata.keys())
            csvwriter.writerow(header)
            c = 1
        csvwriter.writerow(list(metadata.values()))
data_info.close()
            


