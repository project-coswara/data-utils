import os
import json
import pandas as pd
from pdb import set_trace as bp

data_path = 'data/20200415'
dest_path = 'data/20200415/20200415.csv'
list_of_ids = os.listdir(data_path)
df = pd.DataFrame()
for x in list_of_ids:
    with open(os.path.join(data_path,x,"metadata.json")) as f:
        metadata = json.load(f)
        metadata_pd = [metadata]
        df_meta = pd.DataFrame(metadata_pd)
        df = df.append(df_meta,ignore_index=True)
df.to_csv(dest_path,index=False)
