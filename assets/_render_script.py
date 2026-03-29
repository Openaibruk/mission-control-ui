#!/usr/bin/env python3
"""Auto-generated Blender Python script from blender-cli."""

import bpy
import math
import os

# ── Clear Default Scene ──────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# ── Scene Settings ──────────────────────────────────────────
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1.0
scene.frame_start = 1
scene.frame_end = 250
scene.frame_current = 1
scene.render.fps = 24

# ── Render Settings ─────────────────────────────────────────
scene.render.engine = 'CYCLES'
scene.render.resolution_x = 800
scene.render.resolution_y = 600
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.cycles.samples = 16
scene.cycles.use_denoising = False

# ── World Settings ──────────────────────────────────────────
world = bpy.data.worlds.get('World')
if world is None:
    world = bpy.data.worlds.new('World')
    scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes.get('Background')
if bg_node:
    bg_node.inputs[0].default_value = (0.05, 0.05, 0.05, 1.0)

# ── Materials ───────────────────────────────────────────────
mat_floor_mat = bpy.data.materials.new(name='floor_mat')
mat_floor_mat.use_nodes = True
bsdf_floor_mat = mat_floor_mat.node_tree.nodes.get('Principled BSDF')
if bsdf_floor_mat:
    bsdf_floor_mat.inputs['Base Color'].default_value = (0.02, 0.02, 0.03, 1.0)
    bsdf_floor_mat.inputs['Metallic'].default_value = 0.9
    bsdf_floor_mat.inputs['Roughness'].default_value = 0.2
    bsdf_floor_mat.inputs['Specular IOR Level'].default_value = 0.5
    bsdf_floor_mat.inputs['Alpha'].default_value = 1.0

mat_nova_mat = bpy.data.materials.new(name='nova_mat')
mat_nova_mat.use_nodes = True
bsdf_nova_mat = mat_nova_mat.node_tree.nodes.get('Principled BSDF')
if bsdf_nova_mat:
    bsdf_nova_mat.inputs['Base Color'].default_value = (0.0, 1.0, 1.0, 1.0)
    bsdf_nova_mat.inputs['Metallic'].default_value = 0.0
    bsdf_nova_mat.inputs['Roughness'].default_value = 0.5
    bsdf_nova_mat.inputs['Specular IOR Level'].default_value = 0.5
    bsdf_nova_mat.inputs['Alpha'].default_value = 1.0
    bsdf_nova_mat.inputs['Emission Color'].default_value = (0.0, 0.8, 1.0, 1.0)
    bsdf_nova_mat.inputs['Emission Strength'].default_value = 20.0

mat_agent_base_mat = bpy.data.materials.new(name='agent_base_mat')
mat_agent_base_mat.use_nodes = True
bsdf_agent_base_mat = mat_agent_base_mat.node_tree.nodes.get('Principled BSDF')
if bsdf_agent_base_mat:
    bsdf_agent_base_mat.inputs['Base Color'].default_value = (0.1, 0.1, 0.15, 1.0)
    bsdf_agent_base_mat.inputs['Metallic'].default_value = 0.8
    bsdf_agent_base_mat.inputs['Roughness'].default_value = 0.3
    bsdf_agent_base_mat.inputs['Specular IOR Level'].default_value = 0.5
    bsdf_agent_base_mat.inputs['Alpha'].default_value = 1.0

mat_agent_head_mat = bpy.data.materials.new(name='agent_head_mat')
mat_agent_head_mat.use_nodes = True
bsdf_agent_head_mat = mat_agent_head_mat.node_tree.nodes.get('Principled BSDF')
if bsdf_agent_head_mat:
    bsdf_agent_head_mat.inputs['Base Color'].default_value = (1.0, 0.0, 1.0, 1.0)
    bsdf_agent_head_mat.inputs['Metallic'].default_value = 0.0
    bsdf_agent_head_mat.inputs['Roughness'].default_value = 0.5
    bsdf_agent_head_mat.inputs['Specular IOR Level'].default_value = 0.5
    bsdf_agent_head_mat.inputs['Alpha'].default_value = 1.0
    bsdf_agent_head_mat.inputs['Emission Color'].default_value = (1.0, 0.0, 1.0, 1.0)
    bsdf_agent_head_mat.inputs['Emission Strength'].default_value = 5.0


# ── Objects ─────────────────────────────────────────────────
# Object: floor
bpy.ops.mesh.primitive_plane_add(size=2.0, location=(0.0, 0.0, 0.0))
obj = bpy.context.active_object
obj.name = 'floor'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (20.0, 20.0, 1.0)
if 'mat_floor_mat' in dir():
    obj.data.materials.append(mat_floor_mat)

# Object: nova
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16, location=(0.0, 0.0, 2.0))
obj = bpy.context.active_object
obj.name = 'nova'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (1.5, 1.5, 1.5)
if 'mat_nova_mat' in dir():
    obj.data.materials.append(mat_nova_mat)

# Object: agent1_base
bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0, vertices=32, location=(4.0, 0.0, 1.0))
obj = bpy.context.active_object
obj.name = 'agent1_base'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.6, 0.6, 1.0)
if 'mat_agent_base_mat' in dir():
    obj.data.materials.append(mat_agent_base_mat)

# Object: agent2_base
bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0, vertices=32, location=(-4.0, 0.0, 1.0))
obj = bpy.context.active_object
obj.name = 'agent2_base'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.6, 0.6, 1.0)
if 'mat_agent_base_mat' in dir():
    obj.data.materials.append(mat_agent_base_mat)

# Object: agent3_base
bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0, vertices=32, location=(0.0, 4.0, 1.0))
obj = bpy.context.active_object
obj.name = 'agent3_base'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.6, 0.6, 1.0)
if 'mat_agent_base_mat' in dir():
    obj.data.materials.append(mat_agent_base_mat)

# Object: agent4_base
bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0, vertices=32, location=(0.0, -4.0, 1.0))
obj = bpy.context.active_object
obj.name = 'agent4_base'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.6, 0.6, 1.0)
if 'mat_agent_base_mat' in dir():
    obj.data.materials.append(mat_agent_base_mat)

# Object: agent1_head
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16, location=(4.0, 0.0, 2.5))
obj = bpy.context.active_object
obj.name = 'agent1_head'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.4, 0.4, 0.4)
if 'mat_agent_head_mat' in dir():
    obj.data.materials.append(mat_agent_head_mat)

# Object: agent2_head
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16, location=(-4.0, 0.0, 2.5))
obj = bpy.context.active_object
obj.name = 'agent2_head'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.4, 0.4, 0.4)
if 'mat_agent_head_mat' in dir():
    obj.data.materials.append(mat_agent_head_mat)

# Object: agent3_head
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16, location=(0.0, 4.0, 2.5))
obj = bpy.context.active_object
obj.name = 'agent3_head'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.4, 0.4, 0.4)
if 'mat_agent_head_mat' in dir():
    obj.data.materials.append(mat_agent_head_mat)

# Object: agent4_head
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16, location=(0.0, -4.0, 2.5))
obj = bpy.context.active_object
obj.name = 'agent4_head'
obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))
obj.scale = (0.4, 0.4, 0.4)
if 'mat_agent_head_mat' in dir():
    obj.data.materials.append(mat_agent_head_mat)


# ── Cameras ─────────────────────────────────────────────────
cam_data = bpy.data.cameras.new(name='MainCam')
cam_data.type = 'PERSP'
cam_data.lens = 50.0
cam_data.sensor_width = 36.0
cam_data.clip_start = 0.1
cam_data.clip_end = 1000.0
cam_obj = bpy.data.objects.new('MainCam', cam_data)
bpy.context.collection.objects.link(cam_obj)
cam_obj.location = (0.0, -12.0, 6.0)
cam_obj.rotation_euler = (math.radians(65.0), math.radians(0.0), math.radians(0.0))
scene.camera = cam_obj


# ── Lights ──────────────────────────────────────────────────
light_data = bpy.data.lights.new(name='CoreLight', type='POINT')
light_data.energy = 1000.0
light_data.color = (0.0, 1.0, 1.0)
light_data.shadow_soft_size = 0.25
light_obj = bpy.data.objects.new('CoreLight', light_data)
bpy.context.collection.objects.link(light_obj)
light_obj.location = (0.0, 0.0, 2.0)
light_obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))

light_data = bpy.data.lights.new(name='FillLight', type='POINT')
light_data.energy = 300.0
light_data.color = (1.0, 0.0, 1.0)
light_data.shadow_soft_size = 0.25
light_obj = bpy.data.objects.new('FillLight', light_data)
bpy.context.collection.objects.link(light_obj)
light_obj.location = (5.0, -5.0, 5.0)
light_obj.rotation_euler = (math.radians(0.0), math.radians(0.0), math.radians(0.0))


# ── Keyframes ───────────────────────────────────────────────
# (none)

# ── Render Output ───────────────────────────────────────────
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = r'/home/ubuntu/.openclaw/workspace/assets/workspace_3d.png'
scene.frame_set(1)

# Render single frame
bpy.ops.render.render(write_still=True)

print('Render complete: /home/ubuntu/.openclaw/workspace/assets/workspace_3d.png')