import os
from pdb import set_trace as bp
import pandas as pd

data_path = '/Users/prashant/Downloads/Coswara/Coswara-data/'
dates = os.listdir(data_path)
ids_done = []
for x in dates:
    folder_name = os.path.join(data_path,x)
    if os.path.isdir(folder_name):
        df = pd.read_csv(os.path.join(folder_name,str(x)+".csv"))
        ids_done.extend(df['id'].to_list())
dest_path = '/Users/prashant/Downloads/Coswara/to_upload/20200416/'
with open(os.path.join(data_path,'pull_data.sh','r')) as f:
    pull_file = f.read().splitlines()
new_pull_file = open('pull_data_new.sh','w')
c1=0
c2=0
for x in pull_file:
    cmd_split = x.split(' ')
    ids = cmd_split[4].split('/')[4]
    if ids in ids_done:
        c1+=1
        continue
    cmd_split[5] = dest_path
    cmd = ' '.join(cmd_split)
    new_pull_file.write(cmd)
    new_pull_file.write('\n')
    c2+=1
print("C1 ",c1)
print("C2 ",c2)
