"""
Constants for segmentation classes and color mappings.
"""
import numpy as np

# 4-class model (original)
CLASS_METADATA_4 = [
    {"id": 0, "name": "background", "color": "#C8543A"},       # Warm rose-red
    {"id": 1, "name": "uterus", "color": "#1A5FA8"},           # Dark blue
    {"id": 2, "name": "fallopian_tube", "color": "#3BB38A"},   # Soft teal
    {"id": 3, "name": "ovary", "color": "#9B72D0"}             # Soft lavender
]

COLOR_MAP_4 = {
    0: (200, 84, 58, 160),    # Warm rose-red (semi-transparent) - background
    1: (26, 95, 168, 230),    # Dark blue - uterus
    2: (59, 179, 138, 220),   # Soft teal - fallopian tube
    3: (155, 114, 208, 220)   # Soft lavender - ovary
}

# 8-class model (round 2)
CLASS_METADATA_8 = [
    {"id": 0, "name": "background", "color": "#C8543A"},               # Warm rose-red
    {"id": 1, "name": "External Iliac Artery", "color": "#E05C5C"},    # Soft rose red
    {"id": 2, "name": "External Iliac Vein", "color": "#5B8AD4"},      # Soft blue
    {"id": 3, "name": "Obturator Nerve", "color": "#3BB38A"},          # Soft teal
    {"id": 4, "name": "Ovary", "color": "#E8A94A"},                    # Soft amber
    {"id": 5, "name": "Ureter", "color": "#E07AB8"},                   # Soft pink
    {"id": 6, "name": "Uterine Artery", "color": "#4AC5D9"},           # Soft cyan
    {"id": 7, "name": "Uterus", "color": "#1A5FA8"}                    # Dark blue
]

COLOR_MAP_8 = {
    0: (200, 84, 58, 160),     # Warm rose-red (semi-transparent) - background
    1: (224, 92, 92, 220),     # Soft rose red - External Iliac Artery
    2: (91, 138, 212, 220),    # Soft blue - External Iliac Vein
    3: (59, 179, 138, 220),    # Soft teal - Obturator Nerve
    4: (232, 169, 74, 220),    # Soft amber - Ovary
    5: (224, 122, 184, 220),   # Soft pink - Ureter
    6: (74, 197, 217, 220),    # Soft cyan - Uterine Artery
    7: (26, 95, 168, 230)     # Dark blue - Uterus
}

# 2-class model (b1_med)
CLASS_METADATA_2 = [
    {"id": 0, "name": "background", "color": "#C8543A"},   # Warm rose-red
    {"id": 1, "name": "tissue", "color": "#E05C5C"}        # Soft rose red
]

COLOR_MAP_2 = {
    0: (200, 84, 58, 160),   # Warm rose-red (semi-transparent) - background
    1: (224, 92, 92, 220)    # Soft rose red - tissue
}

# Default (backwards compatibility)
CLASS_METADATA = CLASS_METADATA_4
COLOR_MAP = COLOR_MAP_4
NUM_CLASSES = 4


def get_color_map(num_classes: int):
    """Get color map based on number of classes."""
    if num_classes == 2:
        return COLOR_MAP_2
    elif num_classes == 8:
        return COLOR_MAP_8
    else:
        return COLOR_MAP_4


def get_class_metadata(num_classes: int):
    """Get class metadata based on number of classes."""
    if num_classes == 2:
        return CLASS_METADATA_2
    elif num_classes == 8:
        return CLASS_METADATA_8
    else:
        return CLASS_METADATA_4
