import json
import os

from tqdm import tqdm

date_string = '2020-04-17'
annotation_data_root = os.path.join('../data/ANNOTATE_DATA/', date_string)
annotation_data_output = os.path.join('../data/annotated_parsed/', date_string)

record_stages = 'breathing-deep,breathing-shallow,cough-heavy,cough-shallow,counting-fast,counting-normal,vowel-a,vowel-e,vowel-o'.split(',')

all_users = os.listdir(annotation_data_root)
print(f'Processing {len(all_users)} users')
p_bar = tqdm(total=len(all_users))
for userId in all_users:
    user_annotation_root = os.path.join(annotation_data_root, userId)
    user_output_loc = os.path.join(annotation_data_output, userId)
    os.makedirs(user_output_loc, exist_ok=True)
    user_annotation_dict = {
        'count': {
            'bad_audio': 0,
            'clean_audio': 0,
            'noisy_audio': 0,
            'low_volume': 0,
            'audio_breaks': 0
        },
        'data': {}
    }
    for stage in record_stages:
        stage_json_file = os.path.join(user_annotation_root, f'{stage}.json')
        if os.path.exists(stage_json_file):
            with open(stage_json_file) as sj:
                stage_json = json.load(sj)

            # Fix for initial annotation which has bad_audio in stage
            if stage_json['stage'] == 'bad_audio':
                stage_json['quality'] = 'bad_audio'
                stage_json['stage'] = stage
            # Fix for initial annotation which has clean tag in json
            if 'clean' in stage_json:
                stage_json['quality'] = 'clean_audio' if stage_json['clean'] == 'y' else 'noisy_audio'
                del stage_json['clean']
            user_annotation_dict['count'][stage_json['quality']] += 1
            user_annotation_dict['count']['low_volume'] += int(stage_json['vol'] == 'n')
            user_annotation_dict['count']['audio_breaks'] += int(stage_json['cont'] == 'n')
            user_annotation_dict['data'][stage] = stage_json

    with open(os.path.join(user_output_loc, 'annotation.json'), 'w') as aj:
        json.dump(user_annotation_dict, aj, indent=4)

    p_bar.update(1)

p_bar.close()