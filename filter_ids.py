import os
import subprocess
from pdb import set_trace as bp
data_path = '/Users/prashant/Downloads/Coswara/data/20200416'
dest_path = '/Users/prashant/Downloads/Coswara/to_upload/20200416/'
ids_file = open('/Users/prashant/Downloads/ids_20200415.txt','r')
with open(os.path.join(data_path,'pull_data.sh','r')) as f:
    pull_file = f.read().splitlines()
new_pull_file = open('pull_data_new.sh','w')
list_of_ids_done = ids_file.read().splitlines()
c1=0
c2=0
for x in pull_file:
    cmd_split = x.split(' ')
    ids = cmd_split[4].split('/')[4]
    if ids in list_of_ids_done:
        c1+=1
        continue
    cmd_split[5] = dest_path
    cmd = ' '.join(cmd_split)
    new_pull_file.write(cmd)
    new_pull_file.write('\n')
    c2+=1
print("C1 ",c1)
print("C2 ",c2)
